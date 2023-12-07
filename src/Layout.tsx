import React, { ReactNode, Suspense } from 'react';

import {
  Loader,
  Container,
} from '@mantine/core';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Container fluid>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </Container>
  );
}
