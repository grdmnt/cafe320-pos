# Cafe 320 POS System

A simple Point of Sale (POS) system built with React and Supabase, optimized for iPad use.

## Features

- **Product Selection**: Simple grid interface for selecting products without images
- **Order Management**: Add/remove items, adjust quantities
- **Customer Input**: Collect customer names for orders
- **Order History**: View and manage all orders
- **Clear Orders**: Admin function to clear all order history
- **iPad Optimized**: Responsive design for tablet use

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings and copy the Project URL and anon public key
3. Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Update the values with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Orders
1. Navigate to "New Order"
2. Select products from the grid
3. Adjust quantities using +/- buttons
4. Click "Proceed to Checkout"
5. Enter customer name
6. Confirm the order

### Viewing Orders
1. Navigate to "Order History"
2. View all orders with details
3. Use "Clear All Orders" to reset the system

## Database Schema

The system uses three main tables:
- `products`: Store available items with names and prices
- `orders`: Store order information with customer names and totals
- `order_items`: Junction table linking orders to products with quantities

## Technologies Used

- React 18
- React Router DOM
- Supabase (PostgreSQL database)
- CSS3 with responsive design

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
