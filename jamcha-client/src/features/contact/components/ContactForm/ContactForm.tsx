// src/features/contact/components/ContactForm/ContactForm.tsx
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { t } from "@/lib/i18n";

interface ContactFormProps {
  form: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

// ✅ memo HERE - complex form with validation, prevent unnecessary re-renders
export const ContactForm = memo<ContactFormProps>(
  ({ form, onSubmit, isLoading }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.nameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("contact.form.namePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.subjectLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("contact.form.subjectPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.messageLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("contact.form.messagePlaceholder")}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? t("contact.form.sendingButton")
            : t("contact.form.submitButton")}
        </Button>
      </form>
    </Form>
  )
);

ContactForm.displayName = "ContactForm";
