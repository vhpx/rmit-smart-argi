import Footer from './Footer';
import React, { FC } from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({
  children,
}: DefaultLayoutProps) => {
  return (
    <div>
      <div className="relative min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
