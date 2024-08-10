// This can be used for resolving paths and keeping them consistent across the whole app
export enum AppRoute {
    HOME = '/',
    DASHBOARD = '/dashboard',
    NEW_SHOPPING_LIST = '/NewShoppingList',
    LOGIN = '/login',
    // THE FOLLOWING ROUTES REQUIRE MORE IN USE (i.e. they have something like :id or :token in the route,
    // which have to be provided as part of generating the URL)
    SHOPPING_LIST_DETAIL = '/shopping-list',
    SHOPPING_LIST_SHARE = '/share',
};