import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, FormEvent } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect if no email provided
  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  // Function to get dashboard route based on role
  const getDashboardRoute = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "triparty":
        return "/triparty";
      case "client":
      default:
        return "/client";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/auth/verify-otp", {
        email,
        otp,
      });

      // IMPORTANT: Clear any cached data from previous user sessions
      queryClient.clear();

      // Get user role from response and navigate to appropriate dashboard
      const userRole = response.data.user?.role || "client";
      const dashboardRoute = getDashboardRoute(userRole);

      // Navigate to role-specific dashboard
      navigate(dashboardRoute, {
        replace: true,
        state: { user: response.data.user },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid or expired OTP";
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      await axios.post("/auth/resend-otp", { email });

      setOtp(""); // Clear OTP input after resending
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP";
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
      {...props}
    >
      <Card className="flex-1 overflow-hidden p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form
            className="flex flex-col items-center justify-center p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <Field className="items-center text-center">
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  We sent a 6-digit code to {email}
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  required
                  containerClassName="gap-4"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
                <FieldDescription className="text-center">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="underline hover:text-primary"
                  >
                    {isResending ? "Resending..." : "Resend"}
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
