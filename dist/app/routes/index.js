"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/users/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const year_route_1 = require("../modules/year/year.route");
const make_route_1 = require("../modules/makes/make.route");
const model_route_1 = require("../modules/models/model.route");
const trim_route_1 = require("../modules/trims/trim.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const tire_size_route_1 = require("../modules/tire-size/tire-size.route");
const driving_type_route_1 = require("../modules/driving-type/driving-type.route");
const tire_route_1 = require("../modules/tire/tire.route");
const wheel_route_1 = require("../modules/wheel/wheel.route");
const brand_route_1 = require("../modules/brand/brand.route");
const cart_route_1 = require("../modules/cart/cart.route");
const review_route_1 = require("../modules/review/review.route");
const wishlist_routes_1 = require("../modules/wishlist/wishlist.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const upload_route_1 = require("../modules/upload-images/upload.route");
const order_route_1 = require("../modules/order/order.route");
const tire_width_route_1 = require("../modules/tire-width/tire-width.route");
const tire_diameter_route_1 = require("../modules/tire-diameter/tire-diameter.route");
const tire_ratio_route_1 = require("../modules/tire-ratio/tire-ratio.route");
const vehicle_type_route_1 = require("../modules/vehicle-type/vehicle-type.route");
const wheel_width_route_1 = require("../modules/wheel-width/wheel-width.route");
const wheel_ratio_route_1 = require("../modules/wheel-ratio/wheel-ratio.route");
const wheel_diameter_route_1 = require("../modules/wheel-diameter/wheel-diameter.route");
const wheel_width_type_route_1 = require("../modules/wheel-width-type/wheel-width-type.route");
const appointment_route_1 = require("../modules/appointment/appointment.route");
const deal_route_1 = require("../modules/deals/deal.route");
const vehicle_route_1 = require("../modules/fleet/vehicle/vehicle.route");
const support_route_1 = require("../modules/fleet/fleetSupport/support.route");
const appointment_route_2 = require("../modules/fleet/fleetAppointment/appointment.route");
const news_route_1 = require("../modules/fleet/fleetNews/news.route");
const fleetUser_routes_1 = require("../modules/fleet/fleetUser/fleetUser.routes");
const fleetAuth_route_1 = require("../modules/fleet/fleetAuth/fleetAuth.route");
const contact_route_1 = require("../modules/contact/contact.route");
const blog_route_1 = require("../modules/blog/blog.route");
const router = express_1.default.Router();
const modulesRoutes = [
    {
        path: "/users",
        module: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        module: auth_route_1.AuthRoutes,
    },
    {
        path: "/years",
        module: year_route_1.YearRoutes,
    },
    {
        path: "/makes",
        module: make_route_1.MakeRoutes,
    },
    {
        path: "/models",
        module: model_route_1.ModelRoutes,
    },
    {
        path: "/trims",
        module: trim_route_1.TrimRoutes,
    },
    {
        path: "/tiresizes",
        module: tire_size_route_1.TireSizeRoutes,
    },
    {
        path: "/categories",
        module: category_route_1.CategoryRoutes,
    },
    {
        path: "/products",
        module: product_route_1.ProductRoutes,
    },
    {
        path: "/driving-type",
        module: driving_type_route_1.DrivingTypeRoutes,
    },
    {
        path: "/tire",
        module: tire_route_1.TireRoutes,
    },
    {
        path: "/tire-width",
        module: tire_width_route_1.TireWidthRoutes,
    },
    {
        path: "/tire-ratio",
        module: tire_ratio_route_1.TireRatioRoutes,
    },
    {
        path: "/tire-diameter",
        module: tire_diameter_route_1.TireDiameterRoutes,
    },
    {
        path: "/vehicle-type",
        module: vehicle_type_route_1.VehicleTypeRoutes,
    },
    {
        path: "/wheel",
        module: wheel_route_1.WheelRoutes,
    },
    {
        path: "/wheel-width",
        module: wheel_width_route_1.WheelWidthRoutes,
    },
    {
        path: "/wheel-ratio",
        module: wheel_ratio_route_1.WheelRatioRoutes,
    },
    {
        path: "/wheel-diameter",
        module: wheel_diameter_route_1.WheelDiameterRoutes,
    },
    {
        path: "/wheel-width-type",
        module: wheel_width_type_route_1.TireWidthTypeRoutes,
    },
    {
        path: "/brand",
        module: brand_route_1.BrandRoutes,
    },
    {
        path: "/cart",
        module: cart_route_1.CartRoutes,
    },
    {
        path: "/reviews",
        module: review_route_1.ReviewRoutes,
    },
    {
        path: "/wishlists",
        module: wishlist_routes_1.WishlistRoutes,
    },
    {
        path: "/payment",
        module: payment_routes_1.PaymentRoutes,
    },
    {
        path: "/order",
        module: order_route_1.OrderRoutes,
    },
    {
        path: "/upload",
        module: upload_route_1.UploadRoutes,
    },
    {
        path: "/appointments",
        module: appointment_route_1.AppointmentRoutes,
    },
    {
        path: "/deals",
        module: deal_route_1.DealRoutes,
    },
    {
        path: "/contacts",
        module: contact_route_1.ContactRoutes,
    },
    {
        path: "/blogs",
        module: blog_route_1.BlogRoutes,
    },
    {
        path: "/fleet-vehicles",
        module: vehicle_route_1.FleetVehicleRoutes,
    },
    {
        path: "/fleet-supports",
        module: support_route_1.FleetSupportRoutes,
    },
    {
        path: "/fleet-appointments",
        module: appointment_route_2.FleetAppointmentRoutes,
    },
    {
        path: "/fleet-news",
        module: news_route_1.FleetNewsRoutes,
    },
    {
        path: "/fleet-users",
        module: fleetUser_routes_1.FleetUserRoutes,
    },
    {
        path: "/fleet-auth",
        module: fleetAuth_route_1.FleetAuthRoutes,
    },
];
modulesRoutes.forEach((route) => router.use(route.path, route.module));
exports.default = router;
