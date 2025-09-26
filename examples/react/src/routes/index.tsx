import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '20px',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Link to="/mewo-company">Mewo Company</Link>
        </div>
    );
}
