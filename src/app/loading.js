import { Skeleton } from '@navikt/ds-react/esm/skeleton';
import { VStack } from '@navikt/ds-react/esm/layout/stack/VStack';

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <VStack gap="4" className="loading">
            <Skeleton variant="rounded" width="60vw" height={70} />
            <Skeleton variant="rounded" width="60vw" height={70} />
            <Skeleton variant="rounded" width="50vw" height={70} />
            <Skeleton variant="rounded" width="60vw" height={70} />
            <Skeleton variant="rounded" width="60vw" height={70} />
            <Skeleton variant="rounded" width="50vw" height={70} />
        </VStack>
    );
}
