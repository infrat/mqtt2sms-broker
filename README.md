# SMS Modem MQTT Broker for Node.js

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This repository contains a Node.js application that acts as an MQTT broker, enabling bidirectional communication with devices equipped with SMS modems using SMS commands and states. The MQTT broker facilitates seamless integration between the MQTT protocol and SMS-based communication, allowing you to control and monitor your devices remotely.

## Features

- **Bidirectional Communication**: The MQTT broker enables bidirectional communication between MQTT clients and devices equipped with SMS modems. You can send SMS commands to control the devices and receive SMS states for monitoring purposes.

- **MQTT Protocol**: The broker fully supports the MQTT protocol, ensuring reliable and efficient messaging between MQTT clients and devices. MQTT provides a lightweight, publish-subscribe messaging pattern, making it ideal for Internet of Things (IoT) applications.

- **SMS Modem Integration**: This application integrates SMS modems with the MQTT broker, enabling seamless interaction between MQTT clients and SMS-enabled devices. You can control and monitor the devices using familiar MQTT topics and payloads.

- **Flexible Topic Structure**: The MQTT broker allows you to define a flexible topic structure that suits your specific application requirements. You can organize topics hierarchically to reflect the device hierarchy or any other logical grouping.

- **Authentication and Authorization**: The broker supports authentication and authorization mechanisms, ensuring secure access to MQTT topics and preventing unauthorized control of devices. You can configure user credentials and access control lists to restrict access as needed.

- **Scalability**: This application is designed to be scalable, allowing you to handle a large number of MQTT clients and devices. It leverages the capabilities of Node.js and its event-driven architecture to efficiently manage concurrent connections.

- **Open-Source and Extensible**: The MQTT broker is open-source, allowing you to customize and extend it to meet your specific needs. You can contribute to the project, add new features, or modify the existing functionality as required.

## Getting Started

To get started with the SMS Modem MQTT Broker, please refer to the [installation guide](docs/installation.md). These resources provide detailed instructions on setting up and configuring the broker for your environment.

## Contributing

Contributions to this project are welcome! If you encounter any issues, have feature suggestions, or would like to contribute enhancements, please check out our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this code as permitted by the license.

## Acknowledgments

We would like to thank the open-source community for their valuable contributions and the developers of the libraries and tools used in this project.

If you have any questions or need further assistance, please don't hesitate to reach out via the issue tracker or by contacting the project maintainer(s).

Happy MQTT messaging with SMS enabled devices!
