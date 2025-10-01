import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Invoice & Estimate Creator Pro</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Create Professional Invoices & Estimates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate professional invoices and estimates with advanced features including itemized billing, 
            tax calculations, payment details, and PDF generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Invoice Creator Card */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Invoice Creator</CardTitle>
                  <CardDescription>
                    Create professional invoices for completed work
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                  Company branding with logo upload
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                  Itemized billing with quantities
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                  Tax calculations and discounts
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                  Payment details with QR codes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-green-500" />
                  PDF generation and export
                </div>
              </div>
              <Link href="/invoice">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Create Invoice
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estimate Creator Card */}
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Estimate Creator</CardTitle>
                  <CardDescription>
                    Create detailed estimates for potential projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                  Project cost estimation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                  Professional quote format
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                  Detailed line items
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                  Bank account details
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                  Convert to invoice later
                </div>
              </div>
              <Link href="/estimate">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                  Create Estimate
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-green-100 rounded-full mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Templates</h4>
              <p className="text-sm text-gray-600 text-center">
                Clean, professional layouts that make a great impression on your clients
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Calculations</h4>
              <p className="text-sm text-gray-600 text-center">
                Automatic tax calculations, discounts, and total computations
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">PDF Export</h4>
              <p className="text-sm text-gray-600 text-center">
                Generate professional PDFs ready for printing or emailing
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}