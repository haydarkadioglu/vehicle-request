# Vehicle Request System

This project is a comprehensive vehicle request management system built with Next.js, Prisma, and Tailwind CSS. It provides a user-friendly interface for hospital staff to request vehicle transportation services, while giving administrators tools to manage and respond to these requests efficiently.

## Overview

The Vehicle Request System was developed for Darulaceze to streamline the process of requesting and managing transportation services. It enables healthcare units to submit vehicle requests for patient transportation, with functionality to track request status and manage approvals.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Development

To start developing:

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start development server
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



## Key Features

- **Request Creation**: Users can submit detailed vehicle transportation requests with information about the patient, destination, and specific needs (wheelchair, stretcher).
- **Request Management**: Users can view their submitted requests and track their status.
- **Driver Panel**: Authorized drivers can view pending requests, approve or reject them, and view historical requests.
- **Admin Panel**: Administrators have full access to all requests with the ability to delete records.
- **Real-time Updates**: The system automatically refreshes data every 10 seconds to ensure users see the most current information.
- **Mobile Responsive**: Fully responsive design that works well on both desktop and mobile devices.
- **Authentication**: Simple authentication system for authorized personnel.

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with support for various database providers
- **Deployment**: Optimized for Vercel deployment

## System Architecture

The application follows a modern architecture with:

1. **Client-side Components**: React components with server and client components separation
2. **Server-side API Routes**: Handles data operations and business logic
3. **Data Layer**: Prisma ORM for database operations
4. **Authentication**: Simple localStorage-based authentication system

## User Roles

- **Regular Users**: Can create requests and view their own submitted requests
- **Drivers/Authorized Personnel**: Can view all requests and approve/reject them
- **Administrators**: Have full access to system data with ability to delete records

