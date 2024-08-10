
---

# Pallet Pro

[Frontend Repository](https://github.com/AhmedHosny2/Pallet-pro-frontend)

## Table of Contents

- Project Title
- Demo
- Table of Contents
- Description
- Technology Stack
- Microservices and Ports
- Usage
- .env.example
- List of Features
- Preview

## Description

Welcome to Pallet Pro! A cutting-edge e-commerce platform where you can buy or rent high-quality plastic pallets. Our microservices-based system leverages Kafka for real-time messaging, NestJS and Next.js for scalable and efficient backend and frontend services, and Tailwind CSS for a sleek, modern design. 

Enjoy a seamless 3D design experience to customize your pallet and explore features like cart, wishlist, favorites, and email integration—all wrapped in a responsive design that works beautifully on any device.

## Technology Stack

- **Backend**: NestJS
- **Frontend**: Next.js
- **Messaging**: Kafka
- **Database**: MongoDB
- **CSS Framework**: Tailwind CSS
- **Containerization**: Docker

## Microservices and Ports

- **User Service**: 5001
- **Product Service**: 5002

## Usage

To run Kafka on macOS:

1. Open 2 Terminals:
   - Terminal 1: `cd /path/to/kafka && bin/zookeeper-server-start.sh config/zookeeper.properties`
   - Terminal 2: `cd /path/to/kafka && bin/kafka-server-start.sh config/server.properties`

## .env.example

```env
MONGODB_URI=<your_mongodb_uri>
```

## List of Features

- 3D pallet design
- Shopping cart
- Wishlist
- Favorites
- Email integration
- Responsive design for all devices

## Preview

[Link to Demo or Preview]
