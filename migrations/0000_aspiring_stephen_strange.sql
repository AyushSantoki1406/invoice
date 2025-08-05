CREATE TABLE "invoice_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"template_data" json NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" text DEFAULT 'invoice',
	"invoice_number" text NOT NULL,
	"company_name" text NOT NULL,
	"company_email" text NOT NULL,
	"company_address" text DEFAULT '',
	"company_phone" text DEFAULT '',
	"company_website" text DEFAULT '',
	"company_logo" text DEFAULT '',
	"client_name" text NOT NULL,
	"client_email" text DEFAULT '',
	"client_address" text DEFAULT '',
	"issue_date" text NOT NULL,
	"due_date" text DEFAULT '',
	"items" json NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"bank_name" text DEFAULT '',
	"bank_account_holder" text DEFAULT '',
	"bank_account" text DEFAULT '',
	"ifsc_code" text DEFAULT '',
	"upi_id" text DEFAULT '',
	"payment_qr_code" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
