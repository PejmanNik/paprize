import http from 'http';
import type { AddressInfo } from 'node:net';
import handler from 'serve-handler';
import { promises as fs } from 'fs';

export interface ReportServer {
    server: http.Server;
    close: () => void;
    getHost: () => string;
}

/**
 * Serves a static report from the specified directory over HTTP.
 *
 * @param dir - The directory containing the static files to serve.
 * @param port - Optional. The port on which the server will listen. If not provided, a random available port will be used.
 * @returns A promise that resolves to a `ReportServer` object, which provides methods to close the server and retrieve its host URL.
 *
 * The server serves files from the specified directory and automatically rewrites requests
 * to `/index.html` for any unmatched routes. Subdirectories in the specified directory are
 * mapped to corresponding routes.
 */
export async function serveReport(
    dir: string,
    port?: number
): Promise<ReportServer> {
    const staticDirectories = (await fs.readdir(dir, { withFileTypes: true }))
        .filter((x) => x.isDirectory())
        .map((x) => ({ source: x.name, destination: `/${x.name}` }));

    const server = http.createServer(
        async (req: http.IncomingMessage, res: http.ServerResponse) => {
            await handler(req, res, {
                public: dir,
                rewrites: [
                    ...staticDirectories,
                    { source: '**', destination: '/index.html' },
                ],
            });
        }
    );

    server.listen(port);
    const address = server.address() as AddressInfo;

    return {
        server,
        close: () => server.close(),
        getHost: () => `http://localhost:${address.port}`,
    };
}
