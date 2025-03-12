import * as dotenv from 'dotenv';
import * as process from 'node:process';
import * as fs from 'node:fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const uploadImageToS3 = async (fileName: string, blob: Blob) => {
  if (!fileName) {
    throw new Error('No file name provided');
  }

  if (!blob) {
    throw new Error('No blob provided');
  }

  const bucketName = process.env.AWS_CDN_BUCKET_NAME;

  const key = `images/products/${fileName}`;
  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  try {
    const buffer = Buffer.from(await blob.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: blob.type,
      })
    );

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const generateDescription = async (productName: string) => {
  const prompt = `Product: ${productName}
                  Write a concise, professional 1 sentence product description suitable for an e-commerce website. `;
  return await queryCohere(prompt);
};

export const generatePrompt = async (productName: string, description: string) => {
  const prompt = `Convert this product info into an image generation prompt with max 100 characters.
                  Focus on presentation of the product.

                  Product: ${productName}
                  Description: ${description}`;
  const res = await queryCohere(prompt);

  if (res) {
    const fileName = `./.local/images/description-${Date.now()}.txt`;
    console.info(`Generated file ${fileName}`);
    fs.writeFileSync(fileName, res, 'utf-8');
  } else {
    console.error('No response from model');
  }
};

export const generateImage = async (prompt: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true,
            use_cache: false,
          },
        }),
      });

      if (!res.ok) {
        console.log(`Attempt ${i + 1} failed:`, res);
        if (i === retries - 1) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // exponential backoff
        continue;
      }

      const blob = await res.blob();

      if (!blob) {
        throw new Error('No blob');
      }

      const buffer = Buffer.from(await blob.arrayBuffer());
      const fileName = `image-${Date.now()}.png`;
      console.info(`Generated file ${fileName}`);
      fs.writeFileSync(`./${fileName}`, buffer);
      return await uploadImageToS3(fileName, blob);
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // exponential backoff
    }
  }
};

const queryCohere = async (prompt: string): Promise<any> => {
  try {
    const res = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus-08-2024',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error(res);
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const data = (await res.json()) as { message: { content: { text: string }[] } };

    return data?.message?.content[0]?.text ?? '';
  } catch (err) {
    console.error(err);
    throw err;
  }
};
