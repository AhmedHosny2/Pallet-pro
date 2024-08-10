
# Pallet Pro

![Pallet Pro](https://github.com/user-attachments/assets/a1d9aedf-9ba2-437c-9124-4f87489bb6c9 "Homepage" )

### Frontend Repository [Here](https://github.com/AhmedHosny2/Pallet-pro-frontend)

## Table of Contents
- [Project Title](#pallet-pro)
- [Description](#description)
- [Technology Stack](#technology-stack)
- [Microservices and Ports](#microservices-and-ports)
- [Usage](#usage)
- [.env.example](#envexample)
- [List of Features](#list-of-features)
- [Preview](#preview)
- [Contributors](#contributors)

## Description
Pallet Pro is an advanced platform for buying and renting high-quality plastic pallets. Leveraging a microservices architecture, it uses Kafka for real-time messaging, NestJS for the backend, and Next.js for the frontend, with Docker containers ensuring scalability. The system features a 3D design tool for pallet customization, a user-friendly interface, and a robust set of e-commerce functionalities.

## Technology Stack
- Next.js - Frontend Framework
- NestJS - Backend Framework
- Kafka - Messaging Service
- MongoDB - Database
- Tailwind CSS - CSS Framework
- Docker - Containerization

## Microservices and Ports
- User Service: Port 5001
- Product Service: Port 5002

## Usage
1. Clone this project.
2. Install dependencies (Kafka, MongoDB, Node.js, etc.).
3. Create a `.env` file using `.env.example`.
4. Run Kafka:
   - Open 2 Terminals:
     - Terminal 1: `cd /path/to/kafka && bin/zookeeper-server-start.sh config/zookeeper.properties`
     - Terminal 2: `cd /path/to/kafka && bin/kafka-server-start.sh config/server.properties`
5. Start the backend services.
6. Start the frontend project by running `npm install` and then `npm start`.
7. Access the application at [http://localhost:3000/](http://localhost:3000/).

## .env.example
```
MONGODB_URI=<your_mongodb_uri>
KAFKA_BROKER_LIST=<your_kafka_broker_list>
CLIENT_URL="http://localhost:3000"
PORT=<port_number>
```

## List of Features
- 3D pallet design tool
- Shopping cart
- Wishlist and Favorites
- Email integration
- Responsive design for all devices

## Preview
### Home Page 
<video width="1000" controls autoplay loop>
  <source src="https://github.com/user-attachments/assets/1b590aaf-7723-4a35-a2f8-6310fd9e322a" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Products
![Home Page Screenshot](https://github.com/user-attachments/assets/298ad7a8-cdad-425f-b511-91156d119912 "Home Page")

### Pallet Customization
<video width="1000" controls autoplay loop>
  <source src="https://github.com/user-attachments/assets/3f3ac386-7ce3-4cb1-8cb6-f2da912d0555" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Log In
![Log In Screenshot](https://github.com/user-attachments/assets/6aac8d82-5d46-469f-8b70-0b07484e031a "Log In")

### User Profile
![User Profile Screenshot](https://github.com/user-attachments/assets/611b6c77-7475-41a3-ab1d-b324c807ad8f "User Profile")

### Cart
<video width="1000" controls autoplay loop>
  <source src="https://github.com/user-attachments/assets/e045eee2-df21-474f-ad30-78f2b1308164" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Check out
![Check Out Screenshot](https://github.com/user-attachments/assets/2e13ca57-b831-4d45-9b12-2bc6105f3e37 "Check Out")

## Contributors
- Ahmed Yehia [Github](https://github.com/AhmedHosny2) [LinkedIn](https://www.linkedin.com/in/ahmed-yehia-155629206/)
- Mohamed Tamer [Github](https://github.com/MooTamer) [LinkedIn](https://www.linkedin.com/in/mohamed-tamer-020a5221a/)
