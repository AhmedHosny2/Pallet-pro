<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Pallet Pro is an advanced platform for buying and renting high-quality plastic pallets. It uses Kafka, NestJS, Next.js, and Docker for scalable, modern e-commerce solutions.">
    <title>Pallet Pro</title>
</head>
<body>
    <header>
        <h1>Pallet Pro</h1>
    </header>
    
    <main>
        <section>
            <h2>Homepage Video</h2>
            <video width="1000" controls>
                <source src="https://github.com/user-attachments/assets/ebf1122e-3799-42bf-a5d3-eba9cbd5fe81" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </section>

        <section>
            <h4>Frontend Repository <a href="https://github.com/AhmedHosny2/Pallet-pro-frontend" target="_blank" rel="noopener noreferrer">Here</a></h4>
        </section>
        
        <section>
            <h2>Demo</h2>
            <h4>You can watch a walkthrough of the website from <a href="" target="_blank" rel="noopener noreferrer">Here</a></h4>
        </section>

        <section>
            <h2>Table of Contents</h2>
            <ul>
                <li>Project Title</li>
                <li>Demo</li>
                <li>Table of Contents</li>
                <li>Description</li>
                <li>Technology Stack</li>
                <li>Microservices and Ports</li>
                <li>Usage</li>
                <li>.env.example</li>
                <li>List of Features</li>
                <li>Preview</li>
                <li>Contributors</li>
            </ul>
        </section>

        <section>
            <h2>Description</h2>
            <p>Pallet Pro is an advanced platform for buying and renting high-quality plastic pallets. Leveraging a microservices architecture, it uses Kafka for real-time messaging, NestJS for the backend, and Next.js for the frontend, with Docker containers ensuring scalability. The system features a 3D design tool for pallet customization, a user-friendly interface, and a robust set of e-commerce functionalities.</p>
        </section>

        <section>
            <h2>Technology Stack</h2>
            <ul>
                <li>Next.js - Frontend Framework</li>
                <li>NestJS - Backend Framework</li>
                <li>Kafka - Messaging Service</li>
                <li>MongoDB - Database</li>
                <li>Tailwind CSS - CSS Framework</li>
                <li>Docker - Containerization</li>
            </ul>
        </section>

        <section>
            <h2>Microservices and Ports</h2>
            <ul>
                <li>User Service: Port 5001</li>
                <li>Product Service: Port 5002</li>
            </ul>
        </section>

        <section>
            <h2>Usage</h2>
            <ol>
                <li>Clone this project</li>
                <li>Install dependencies (Kafka, MongoDB, Node.js, etc.)</li>
                <li>Create a .env file using .env.example</li>
                <li>Run Kafka:
                    <ul>
                        <li>Open 2 Terminals: 
                            <ul>
                                <li>Terminal 1: `cd /path/to/kafka && bin/zookeeper-server-start.sh config/zookeeper.properties`</li>
                                <li>Terminal 2: `cd /path/to/kafka && bin/kafka-server-start.sh config/server.properties`</li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>Start the backend services</li>
                <li>Start the frontend project by running `npm install` and then `npm start`</li>
                <li>Access the application at `http://localhost:3000/`</li>
            </ol>
        </section>

        <section>
            <h2>.env.example</h2>
            <p>
                MONGODB_URI=&lt;your_mongodb_uri&gt;<br>
                KAFKA_BROKER_LIST=&lt;your_kafka_broker_list&gt;<br>
                CLIENT_URL="http://localhost:3000"<br>
                PORT=&lt;port_number&gt;<br>
            </p>
        </section>

        <section>
            <h2>List of Features</h2>
            <ul>
                <li>3D pallet design tool</li>
                <li>Shopping cart</li>
                <li>Wishlist and Favorites</li>
                <li>Email integration</li>
                <li>Responsive design for all devices</li>
            </ul>
        </section>

        <section>
            <h2>Preview</h2>
            <div>
                <h3>Products</h3>
                <img src="https://github.com/user-attachments/assets/298ad7a8-cdad-425f-b511-91156d119912" alt="Home Page Screenshot" title="Home Page" width="1000">
            </div>
            
            <div>
                <h3>Pallet Customization</h3>
                <img src="README_Files/PalletCustomization.png" alt="Pallet Customization Screenshot" title="Pallet Customization" width="1000">
            </div>

            <div>
                <h3>Log In</h3>
                <img src="https://github.com/user-attachments/assets/6aac8d82-5d46-469f-8b70-0b07484e031a" alt="Log In Screenshot" title="Log In" width="1000">
            </div>

            <div>
                <h3>User Profile</h3>
                <img src="https://github.com/user-attachments/assets/611b6c77-7475-41a3-ab1d-b324c807ad8f" alt="User Profile Screenshot" title="User Profile" width="1000">
            </div>

            <div>
                <h3>Cart</h3>
                <img src="https://github.com/user-attachments/assets/f7684ff3-a6b2-4a12-9256-5195477b8239" alt="Cart Screenshot" title="Cart" width="1000">
            </div>

            <div>
                <h3>Check Out</h3>
                <img src="https://github.com/user-attachments/assets/2e13ca57-b831-4d45-9b12-2bc6105f3e37" alt="Check Out Screenshot" title="Check Out" width="1000">
            </div>
        </section>

        <section>
            <h2>Contributors</h2>
            <ul>
                <li>Ahmed Yehia <a href="https://github.com/AhmedHosny2" target="_blank" rel="noopener noreferrer">Github</a> <a href="https://www.linkedin.com/in/ahmed-yehia-155629206/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li>Mohamed Tamer <a href="https://github.com/MooTamer" target="_blank" rel="noopener noreferrer">Github</a> <a href="https://www.linkedin.com/in/mohamed-tamer-020a5221a/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
        </section>
    </main>
</body>
</html>
