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
                                <a href="modules/ApiModule.html" data-type="entity-link" >ApiModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CartComponent.html" data-type="entity-link" >CartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CartIconComponent.html" data-type="entity-link" >CartIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CartItemsComponent.html" data-type="entity-link" >CartItemsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CheckoutComponent.html" data-type="entity-link" >CheckoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateTimeComponent.html" data-type="entity-link" >DateTimeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormErrorComponent.html" data-type="entity-link" >FormErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavigationComponent.html" data-type="entity-link" >NavigationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrderDetailComponent.html" data-type="entity-link" >OrderDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrderListComponent.html" data-type="entity-link" >OrderListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrderStatusComponent.html" data-type="entity-link" >OrderStatusComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductDetailComponent.html" data-type="entity-link" >ProductDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductListComponent.html" data-type="entity-link" >ProductListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductSearchComponent.html" data-type="entity-link" >ProductSearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserNavigationComponent.html" data-type="entity-link" >UserNavigationComponent</a>
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
                                <a href="classes/Configuration.html" data-type="entity-link" >Configuration</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomHttpParameterCodec.html" data-type="entity-link" >CustomHttpParameterCodec</a>
                            </li>
                            <li class="link">
                                <a href="classes/NavigationItem.html" data-type="entity-link" >NavigationItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoReuseStrategy.html" data-type="entity-link" >NoReuseStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouteItem.html" data-type="entity-link" >RouteItem</a>
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
                                    <a href="injectables/AuthFacade.html" data-type="entity-link" >AuthFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartFacade.html" data-type="entity-link" >CartFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KeycloakService.html" data-type="entity-link" >KeycloakService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonitoringFacade.html" data-type="entity-link" >MonitoringFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderApi.html" data-type="entity-link" >OrderApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderDataService.html" data-type="entity-link" >OrderDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderFacade.html" data-type="entity-link" >OrderFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionService.html" data-type="entity-link" >PermissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrintInvoiceService.html" data-type="entity-link" >PrintInvoiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductApi.html" data-type="entity-link" >ProductApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductDataService.html" data-type="entity-link" >ProductDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductFacade.html" data-type="entity-link" >ProductFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShoppingSessionApi.html" data-type="entity-link" >ShoppingSessionApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserApi.html" data-type="entity-link" >UserApi</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserFacade.html" data-type="entity-link" >UserFacade</a>
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
                                <a href="interfaces/AddCartItemRequest.html" data-type="entity-link" >AddCartItemRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AdditionalState.html" data-type="entity-link" >AdditionalState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AddressResponse.html" data-type="entity-link" >AddressResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthConfig.html" data-type="entity-link" >AuthConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CartItemResponse.html" data-type="entity-link" >CartItemResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CheckoutAddressForm.html" data-type="entity-link" >CheckoutAddressForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CheckoutForm.html" data-type="entity-link" >CheckoutForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigurationParameters.html" data-type="entity-link" >ConfigurationParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetOrderByIdRequest.html" data-type="entity-link" >GetOrderByIdRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetProductByIdRequest.html" data-type="entity-link" >GetProductByIdRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpValidationProblemDetails.html" data-type="entity-link" >HttpValidationProblemDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageResponse.html" data-type="entity-link" >ImageResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoredUser.html" data-type="entity-link" >MonitoredUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitoringConfig.html" data-type="entity-link" >MonitoringConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NavigationConfig.html" data-type="entity-link" >NavigationConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderItemResponse.html" data-type="entity-link" >OrderItemResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderListResponse.html" data-type="entity-link" >OrderListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrderResponse.html" data-type="entity-link" >OrderResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Param.html" data-type="entity-link" >Param</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemDetails.html" data-type="entity-link" >ProblemDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductListResponse.html" data-type="entity-link" >ProductListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductResponse.html" data-type="entity-link" >ProductResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RemoveCartItemRequest.html" data-type="entity-link" >RemoveCartItemRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Request.html" data-type="entity-link" >Request</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ShoppingSessionResponse.html" data-type="entity-link" >ShoppingSessionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateCartItemQuantityRequest.html" data-type="entity-link" >UpdateCartItemQuantityRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateCartItemQuantityRequestWrapper.html" data-type="entity-link" >UpdateCartItemQuantityRequestWrapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateCartItemQuantityResponse.html" data-type="entity-link" >UpdateCartItemQuantityResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateUserAddressRequest.html" data-type="entity-link" >UpdateUserAddressRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateUserPhoneRequest.html" data-type="entity-link" >UpdateUserPhoneRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPhoneResponse.html" data-type="entity-link" >UserPhoneResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationProblemDetails.html" data-type="entity-link" >ValidationProblemDetails</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
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