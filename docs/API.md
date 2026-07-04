# AL SHISR API Documentation

## Base URL

```
http://localhost:4000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new customer |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/verify-email?token=` | Verify email |
| POST | `/auth/logout` | Logout (protected) |

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (pagination, filters) |
| GET | `/products/:slug` | Get product by slug |
| GET | `/products/:id/related` | Related products |
| POST | `/products` | Create product (admin) |
| PATCH | `/products/:id` | Update product (admin) |
| DELETE | `/products/:id` | Delete product (admin) |

## Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List user orders |
| GET | `/orders/:id` | Get order details |
| POST | `/orders` | Create order from cart |
| PATCH | `/orders/:id/status` | Update status (admin) |

## Cart & Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get cart |
| POST | `/cart` | Add to cart |
| PATCH | `/cart/:id` | Update quantity |
| DELETE | `/cart/:id` | Remove item |
| DELETE | `/cart` | Clear cart |
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist/:productId` | Add to wishlist |
| DELETE | `/wishlist/:productId` | Remove from wishlist |

## CMS

Public endpoints for sliders, banners, blogs, pages, FAQs, and testimonials.

## Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/analytics` | Revenue & order analytics |

## Swagger

Interactive API documentation available at:

```
http://localhost:4000/api/docs
```
