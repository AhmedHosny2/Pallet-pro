
# Pallet Pro

![image](https://github.com/user-attachments/assets/cced2401-6345-40e2-90b0-2a26707132b4)

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


https://github.com/user-attachments/assets/453644ff-74bb-406c-8916-4494703f6448


### Products
![Home Page Screenshot](https://github.com/user-attachments/assets/298ad7a8-cdad-425f-b511-91156d119912 "Home Page")

### Pallet Customization



https://github.com/user-attachments/assets/9ffe32cf-99e4-48e7-8711-69c4075dd751




### Log In
![Log In Screenshot](https://github.com/user-attachments/assets/6aac8d82-5d46-469f-8b70-0b07484e031a "Log In")

### User Profile
![User Profile Screenshot](https://github.com/user-attachments/assets/611b6c77-7475-41a3-ab1d-b324c807ad8f "User Profile")

### Cart



https://github.com/user-attachments/assets/94d3a39b-5d9c-42d2-9bf1-5d9921785a90


### Check out
![Check Out Screenshot](https://github.com/user-attachments/assets/2e13ca57-b831-4d45-9b12-2bc6105f3e37 "Check Out")

## Contributors
- Ahmed Yehia [Github](https://github.com/AhmedHosny2) [LinkedIn](https://www.linkedin.com/in/ahmed-yehia-155629206/)
- Mohamed Tamer [Github](https://github.com/MooTamer) [LinkedIn](https://www.linkedin.com/in/mohamed-tamer-020a5221a/)
- Mazen Elshiny [Github](https://github.com/mznmo) [LinkedIn](https://www.linkedin.com/in/mazen-elshiny/)
- Mostafa Ramadan [Github](https://github.com/mostafaHossamEldin) [LinkedIn](https://www.linkedin.com/in/mosvdh/)
- Omar Dawood [Github](https://github.com/CrashOfTheTitans) [LinkedIn](https://www.linkedin.com/in/omardawood/)
  
