'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@demo-shop/source documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CartItemModule.html" data-type="entity-link" >CartItemModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' : 'data-bs-target="#xs-controllers-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' :
                                            'id="xs-controllers-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' }>
                                            <li class="link">
                                                <a href="controllers/CartItemController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartItemController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' : 'data-bs-target="#xs-injectables-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' :
                                        'id="xs-injectables-links-module-CartItemModule-67c5bdfa9f7e3d1857679bc02daf9947672ecf1d4ad55d507f16e0095f3b9a7f5122cc9c5061ede4b082e671514e47074c339bd170d9e2416d786c694e3315ef"' }>
                                        <li class="link">
                                            <a href="injectables/CartItemRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartItemRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CartItemService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartItemService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link" >CommonModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommonModule-d21c38db6f1dc525b8ccfe78c2d57bb95e13b644f390b1a6c2180d22ca368d9678002979b80756678adbff4485537a2a616de64e4f8f9ff041fa2707aa0c8e65"' : 'data-bs-target="#xs-injectables-links-module-CommonModule-d21c38db6f1dc525b8ccfe78c2d57bb95e13b644f390b1a6c2180d22ca368d9678002979b80756678adbff4485537a2a616de64e4f8f9ff041fa2707aa0c8e65"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonModule-d21c38db6f1dc525b8ccfe78c2d57bb95e13b644f390b1a6c2180d22ca368d9678002979b80756678adbff4485537a2a616de64e4f8f9ff041fa2707aa0c8e65"' :
                                        'id="xs-injectables-links-module-CommonModule-d21c38db6f1dc525b8ccfe78c2d57bb95e13b644f390b1a6c2180d22ca368d9678002979b80756678adbff4485537a2a616de64e4f8f9ff041fa2707aa0c8e65"' }>
                                        <li class="link">
                                            <a href="injectables/MonitoringService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonitoringService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrderModule.html" data-type="entity-link" >OrderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' : 'data-bs-target="#xs-controllers-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' :
                                            'id="xs-controllers-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' }>
                                            <li class="link">
                                                <a href="controllers/OrderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' : 'data-bs-target="#xs-injectables-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' :
                                        'id="xs-injectables-links-module-OrderModule-8256f259813b3258273bafeb895a677202ea1a2e188fa23af28828a47384da1c3e7b37b2fd7f3d27fca22f88605faf247ab152e6fb79492fce5a8c3362592ef7"' }>
                                        <li class="link">
                                            <a href="injectables/OrderRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductModule.html" data-type="entity-link" >ProductModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' : 'data-bs-target="#xs-controllers-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' :
                                            'id="xs-controllers-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' }>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' : 'data-bs-target="#xs-injectables-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' :
                                        'id="xs-injectables-links-module-ProductModule-493502ebc93f4428734630100255ea6808d5ba2b3462a11dda628ee5b7dec8a2e2f5dc5e2a8f2334f8c1b73beb2714d9e6b4f8ae28c39c12d06a0c6a3d8990ab"' }>
                                        <li class="link">
                                            <a href="injectables/ProductRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ShoppingSessionModule.html" data-type="entity-link" >ShoppingSessionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' : 'data-bs-target="#xs-controllers-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' :
                                            'id="xs-controllers-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' }>
                                            <li class="link">
                                                <a href="controllers/ShoppingSessionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShoppingSessionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' : 'data-bs-target="#xs-injectables-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' :
                                        'id="xs-injectables-links-module-ShoppingSessionModule-861b884ef5eb76b0402ad9c5ac76c529932a574e7a46cb2eca319ac99dc422a9db6e56966057305f8f5f16f89ac571c8998ed59e566e0adf7bc5cf595d941ed6"' }>
                                        <li class="link">
                                            <a href="injectables/ShoppingSessionRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShoppingSessionRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ShoppingSessionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShoppingSessionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' : 'data-bs-target="#xs-controllers-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' :
                                            'id="xs-controllers-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' : 'data-bs-target="#xs-injectables-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' :
                                        'id="xs-injectables-links-module-UserModule-56ec0dbf35942e482524f9c96a243426298cbdf54119bc04cbc0b108cd3236f1d5a90665b701f30a023606e2d9ed1e7d5733f162113de58091fd4c55b8f4a3b3"' }>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddCartItemRequest.html" data-type="entity-link" >AddCartItemRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddressResponse.html" data-type="entity-link" >AddressResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartItemResponse.html" data-type="entity-link" >CartItemResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CatchEverythingFilter.html" data-type="entity-link" >CatchEverythingFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDto.html" data-type="entity-link" >CreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderItemDto.html" data-type="entity-link" >CreateOrderItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageResponse.html" data-type="entity-link" >ImageResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderItemResponse.html" data-type="entity-link" >OrderItemResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderListResponse.html" data-type="entity-link" >OrderListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderResponse.html" data-type="entity-link" >OrderResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductListResponse.html" data-type="entity-link" >ProductListResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductResponse.html" data-type="entity-link" >ProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShoppingSessionResponse.html" data-type="entity-link" >ShoppingSessionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartItemQuantityRequest.html" data-type="entity-link" >UpdateCartItemQuantityRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserAddressRequest.html" data-type="entity-link" >UpdateUserAddressRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserPhoneRequest.html" data-type="entity-link" >UpdateUserPhoneRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserIdentity.html" data-type="entity-link" >UserIdentity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DecodeTokenPipe.html" data-type="entity-link" >DecodeTokenPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CartItemRepositoryModel.html" data-type="entity-link" >CartItemRepositoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoredUser.html" data-type="entity-link" >MonitoredUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderRepositoryModel.html" data-type="entity-link" >OrderRepositoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductRepositoryModel.html" data-type="entity-link" >ProductRepositoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShoppingSessionRepositoryModel.html" data-type="entity-link" >ShoppingSessionRepositoryModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRepositoryModel.html" data-type="entity-link" >UserRepositoryModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});