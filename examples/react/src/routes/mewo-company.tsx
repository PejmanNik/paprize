import { createFileRoute } from '@tanstack/react-router';
import MewoCompany from '../mewo-company';

export const Route = createFileRoute('/mewo-company')({
    component: RouteComponent,
});

function RouteComponent() {
    return <MewoCompany />;
}
