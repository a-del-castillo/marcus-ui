# Marcus Bikes UI
A modular React-based single-page application for customizing, ordering, and managing bike parts and configurations.

### Project Overview
Marcus Bikes is a comprehensive e-commerce platform that allows users to browse bike parts, create custom bike configurations, manage shopping carts, and place orders. The application features role-based access control, with administrators having additional capabilities to manage orders and product details.

### Application Structure
The application follows a modular architecture with a clear separation of containers (major functional modules) and components (reusable UI elements):

## Core Application
`App.jsx`: The main application skeleton that orchestrates all modules and contains shared functionality used across multiple components, including:
- User authentication management
- Session handling
- Cart operations (adding/removing items)
- Base API communication with the backend

### Containers (Main Modules)
- `PartsList.jsx`: Catalog of available bike parts with filtering capabilities
- `Configurator.jsx`: Interactive bike customization tool allowing users to build custom configurations
- `Cart.jsx`: Shopping cart module for reviewing and managing selected items
- `LoginForm.jsx`: Authentication module with additional order management features for administrators

### Components (UI Elements)
- `PartCard.jsx`: Card component for displaying individual parts in the catalog
- `PartModal.jsx`: Detailed product view with editing capabilities for administrators
- `SearchBar.jsx`: Filtering component for the parts catalog with name and category search
- `CartEntry.jsx`: Line item component for products or custom configurations in the shopping cart
- `Incompatibilities.jsx`: Component for displaying product compatibility information
- `SpecialPrice.jsx`: Component for displaying price modifiers and special pricing rules
- `UserOrders.jsx`: Administrative component for managing customer orders

### Key Features
- **Product Catalog**: Browse and search for bike parts by name and category
- **Bike Configurator**: Build custom bike configurations with compatible parts
- **Shopping Cart**: Add individual parts or complete custom configurations
- **User Authentication**: Secure login system with role-based permissions
- **Admin Dashboard**: Manage products and user orders (admin only)
- **Responsive Design**: Optimized for various screen sizes and devices

### Technical Details
- Built with React using a modular component architecture
- State management with React hooks (useState)
- API communication with Axios
- Environment-aware configuration for development and production
- Token-based authentication with local storage persistence
- Responsive UI with CSS

### Development and Production
The application is configured to work with different backend endpoints based on the environment:

- Development: `http://127.0.0.1:3000`
- Production: `https://marcus-api.onrender.com`

### Getting Started
- Clone the repository
- Install dependencies with `npm install`
- Start the development server with `npm run dev`
- Access the application at `http://localhost:5173` (or the port specified by your Vite configuration)

### API Integration
The application communicates with a RESTful backend API for all data operations, including:

- User authentication
- Product catalog retrieval
- Order creation and management
- Custom configuration storage

### Usage
#### Product UI:
This is sorted by using two different product views, a teaser one in form of a small card containing product name and its category: 

![image](https://github.com/user-attachments/assets/ff954c02-f900-40a5-a714-d3e29d549c11)

And an extended view (accessed by clicking on teaser view) in form of a modal window with a detailed product view that provides information on incompatible parts: 

![image](https://github.com/user-attachments/assets/d3049c08-a97c-4ee6-847e-8f1baea4968c)

Special prices when a part is combined with others are also shown in this detailed view:

![image](https://github.com/user-attachments/assets/944797d8-39d8-4ce4-850a-cd1818ae1a81)

Products are presented in a list view with its own search bar:

![image](https://github.com/user-attachments/assets/6d900a9e-384a-463d-bfa8-53077276aceb)

Search bar filters list contents by name or category:

![image](https://github.com/user-attachments/assets/f5b85246-4192-4670-a488-b21adc22412c)

Products can are also be found in the configurator piece distributed by their categories:

![image](https://github.com/user-attachments/assets/2531ac2a-2375-4426-9086-d3c27683c081)

Each category contains its products:

![image](https://github.com/user-attachments/assets/a33a7329-f1a8-4868-9f25-5e5ae0882bce)

When adding selecting a part its price can be found besides it and total configuration price is updated:

![image](https://github.com/user-attachments/assets/8966e676-a376-410a-872e-f02c70a5b315)

If a part containing a price modifier in tandem with any other part is selected price modifier will be applied in both part and configuration price: 

![image](https://github.com/user-attachments/assets/c224ee6a-ec3e-45cf-a095-d9e3280081e3)

If an incompatible part is selected in a configuration its incompatible parts will not be available for the user to select (all three frames are available):

![image](https://github.com/user-attachments/assets/9c4b0a71-87d9-4049-a70b-2e18b59eccea)

After selecting Shiny frame finish only the two compatible Frames are still available to be selected:

![image](https://github.com/user-attachments/assets/bd997a65-f445-4871-bff1-0faeb7c661bd)

This UI limitation works in both directions (by adding Step through frame Shiny finish becomes unavailable):

![image](https://github.com/user-attachments/assets/64beb422-0608-48aa-8210-27534712312d)

Users can add both Parts and custom bike configurations to their carts:

![image](https://github.com/user-attachments/assets/cd857175-9c41-4085-a3d4-38e66782d0bd)

![image](https://github.com/user-attachments/assets/219d90de-35cb-437f-b693-4395b4907a3d)

And order price is updated with the sum of the prices from both lists

Products and configs can be removed from the shopping cart by pressing the red X icon of each item 

![image](https://github.com/user-attachments/assets/47ac61d7-d228-4383-a095-0cd85bf96a4d)

By pressing Process order button besides Total cart Price simulates payment process and sends a request notifying the API and clearing the cart contents (requires user to be authenticated)

![image](https://github.com/user-attachments/assets/4d0fc9a0-8ba3-41b4-9256-7a951af0bcc9)

![image](https://github.com/user-attachments/assets/1ef98d2a-d4b1-4c53-8047-0ecf5f0db216)


#### User actions:
Users can sign up by using "sign up" link in LoginForm:

![image](https://github.com/user-attachments/assets/8903ad83-e608-4833-86eb-7a7c479327f9)

By doing this sign up form will become visible (it is almost identical to login form):

![image](https://github.com/user-attachments/assets/ac25643e-962f-417c-969a-1e36f091da27)

Once a user has signed up can perform log in action:

![image](https://github.com/user-attachments/assets/fb6b6586-1119-4ea9-af3f-bf0fcb84ce09)

![image](https://github.com/user-attachments/assets/79880feb-df93-4742-98d2-a2daf5058be7)


#### Admin user/backoffice
By signing in with a user whose role in the db is 'admin' you'll get access to product management (create, update, delete) and order management (update status to 'Processed')  

![image](https://github.com/user-attachments/assets/942ff791-4cac-4a00-8580-b52d7beaf901)

**Product creation**
Create product link will provide a modal window for the admin to create a new product:

![image](https://github.com/user-attachments/assets/b221f690-8967-479a-bc89-3c10fe0d79ea)

![image](https://github.com/user-attachments/assets/0f34ff9d-d30d-4acc-9b48-9725a70f45a8)

Incompatibilities with other parts and special prices can't be added until new product is created in the db:

![image](https://github.com/user-attachments/assets/f907b783-24c0-4718-b514-05c2c9332da8)

After it ha been created it will show up in the list view and can be accessed by the admin for edit/delete:

![image](https://github.com/user-attachments/assets/f571262a-d44c-45bb-884c-c97060c1ae85)

![image](https://github.com/user-attachments/assets/df8d9bdb-fd45-4207-8556-0758a9cb17f2)

And now Incompatible configurator parts and special prices when combined with other parts can be added:

![image](https://github.com/user-attachments/assets/c1ad6567-440f-4d43-893b-8d3991b3fba5)


**Order management**
By clicking in "Manage user orders" admin users will access order management panel:

![image](https://github.com/user-attachments/assets/cc0a2305-f66f-4e0e-b335-7eb01e00e0db)

where they can update paid orders into processed ones by clicking the green button besides them:

![image](https://github.com/user-attachments/assets/4e5e4483-bfb2-417b-a34b-e9c8bb81a2b0)


#### Improvements / TO-DO list
- Save current cart in cookies if user is not logged, currently only signed in users can retrieve their 'in cart' orders by signing in, adding the same functionality based on cookies would be a nice QoL improvement. 
- Improve order management for admin users, currently we can only update an order from 'paid' to 'processed' as an admin user, where providing more status and tools to use those would be the better approach for admin users.
- Add oreder management for regular users, or at least provide a place for them to check their orders and its status.
- Form inputs validation.
- better responsiveness.
- And of course adding part image field, not required for the challenge nor for any functionality, but 100% required in terms of UX.


  
