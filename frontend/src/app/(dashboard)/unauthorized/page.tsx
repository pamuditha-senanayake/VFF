import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 text-center">
      <AlertCircle className="h-24 w-24 text-red-500" />
      <h1 className="text-4xl font-bold font-heading text-text-primary">Unauthorized Access</h1>
      <p className="text-lg text-text-secondary max-w-md">
        You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link href="/dashboard">
        <Button>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
