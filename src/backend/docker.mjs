import Docker from 'dockerode';

export async function dockerize(image) {
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    const imagePortMap = {
        'nginx-cookie-sqli': { exposedPort: '5000/tcp', hostPort: '80' },
        'none-alg-jwt': { exposedPort: '5000/tcp', hostPort: '5000' },
        'weak-jwt-secret': { exposedPort: '5001/tcp', hostPort: '5001' },
        'ssrf': { exposedPort: '5002/tcp', hostPort: '5002' },
        'robots': { exposedPort: '5003/tcp', hostPort: '5003' },
        'easy_sqli': { exposedPort: '5004/tcp', hostPort: '5004' },
        'directory_traversal': { exposedPort: '5005/tcp', hostPort: '5005' },
    };

    const portConfig = imagePortMap[image];

    if (!portConfig) {
        console.error(`Image ${image} not found in configuration.`);
        return;
    }

    try {
        const container = await docker.createContainer({
            Image: image,
            ExposedPorts: { [portConfig.exposedPort]: {} },
            HostConfig: {
                PortBindings: { [portConfig.exposedPort]: [{ HostPort: portConfig.hostPort }] },
            },
        });

        console.log('Container created');
        await container.start();
        console.log('Container started');

        setTimeout(async () => {
            try {
                await container.stop();
                console.log(`Container ${container.id} stopped after 10 seconds`);
                await container.remove();
                console.log(`Container ${container.id} removed`);
            } catch (err) {
                console.error(`Error stopping/removing container ${container.id}:`, err);
            }
        }, 10 * 1000);
    } catch (err) {
        console.error('Docker error:', err);
    }
}
