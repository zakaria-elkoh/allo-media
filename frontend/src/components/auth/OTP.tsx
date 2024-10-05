import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OTP = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    console.log("data", data);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  }
  return (
    <div className="h-full flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col justify-center shadow-md mt-20 rounded-lg p-6 min-w-72 bg-white"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify it is your account</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 text-2xl"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 text-2xl"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 text-2xl"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 text-2xl"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-10 h-10 text-2xl"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-10 h-10 text-2xl"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the OTP password sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            className={`mt-6 flex gap-1 ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OTP;
