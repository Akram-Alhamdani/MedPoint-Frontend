import { type ReactNode } from "react";
import { ThemeProvider, useTheme } from "@/shared/providers";
import { Provider as ReduxProvider } from "react-redux";
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider";
import { store } from "@/store";
import { Toaster } from "@/shared/components/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ReactQueryProvider>
        <ThemeProvider defaultTheme="light">
          <ThemeConsumerWrapper>{children}</ThemeConsumerWrapper>
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}

function ThemeConsumerWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      <Toaster theme={theme} richColors />
      {children}
    </>
  );
}
