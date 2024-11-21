"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);
      console.log(result);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Startup Pitch created successfully",
          variant: "destructive",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.formErrors.fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Form validation failed",
          description: "Please fix the errors in the form.",
          variant: "destructive",
        });
        return {
          ...prevState,
          error: "Form validation failed",
          status: "ERROR",
        };
      }
      toast({
        title: "Form submission failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
    title: "",
    description: "",
    category: "",
    link: "",
  });

  const [pitch, setPitch] = useState<string>("");

  return (
    <form action={formAction} className="startup-form">
      <div>
        <Label htmlFor="title" className="startup-form_label">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          defaultValue={state.title}
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <Label htmlFor="description" className="startup-form_label">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <Label htmlFor="category" className="startup-form_label">
          Category
        </Label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup category(Tech, Health, Education ...)"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <Label htmlFor="link" className="startup-form_label">
          Image URL
        </Label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div>
        <Label htmlFor="pitch" className="startup-form_label">
          Pitch
        </Label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          preview="edit"
          height={300}
          style={{
            borderRadius: 20,
            backgroundColor: "#fff",
            color: "#000",
            overflow: "hidden",
          }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem does it solve",
          }}
          previewOptions={{ disallowedElements: ["style"] }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="startup-form_btn text-white"
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 " />
      </Button>
    </form>
  );
};

export default StartupForm;
