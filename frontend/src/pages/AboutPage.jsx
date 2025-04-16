import {
  Rocket,
  ShoppingCart,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  Home,
  Users,
  Heart,
  ThumbsUp,
  Star,
  KeyIcon,
  Code2,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">About HUT</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your neighborhood delivery hub - connecting you to local shops with
          lightning-fast service.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16 bg-orange-50 p-8 rounded-xl">
        <div className="flex items-center mb-6">
          <Home className="text-orange-500 mr-3" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">Our Story</h2>
        </div>
        <p className="text-gray-700 mb-4">
          HUT is developed for a local area.We know,the other food delivery
          app/website work for the people also,but the people don't know from
          which restaurant their foods or other delivery goods come.I already
          said,HUT is just for local area.The people of a local area can order a
          item from his/her known shop.It take too law service charge and work
          rapidly.
        </p>
        <p className="text-gray-700">
          Anyone can open a shop freely in this website and starts his/ her
          business without any cost. I would like to request all to use this and
          make the business process more digital.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          How HUT Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">1. Find Local HUTs</h3>
            <p className="text-gray-600">
              Discover shops in your area with real-time availability and
              pricing through our HUT network.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">2. Place Your Order</h3>
            <p className="text-gray-600">
              Select items from any HUT partner shop and provide your delivery
              details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">3. HUT Approval</h3>
            <p className="text-gray-600">
              The HUT shop approves your order and provides a unique 4-digit
              Delivery PIN.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-medium mb-2">4. HUT Delivery</h3>
            <p className="text-gray-600">
              Receive your items within 20 minutes from your local HUT partner.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16 bg-orange-50 p-8 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Why Choose HUT?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <Clock className="text-orange-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1">HUT Speed</h3>
              <p className="text-gray-600">
                Average delivery time under 20 minutes from your nearest HUT
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Heart className="text-orange-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1">HUT Local Network</h3>
              <p className="text-gray-600">
                Supporting neighborhood businesses in our HUT community
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Shield className="text-orange-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1">HUT Security</h3>
              <p className="text-gray-600">
                PIN-protected deliveries for your safety
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Star className="text-orange-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium mb-1">HUT Quality</h3>
              <p className="text-gray-600">
                Fresh products from trusted HUT partner shops
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Shop Owners */}
      <section className="mb-16">
        <div className="flex items-center mb-6">
          <Users className="text-orange-500 mr-3" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">
            Join the HUT Network
          </h2>
        </div>
        <p className="text-gray-700 mb-6">
          HUT helps local businesses expand their reach, manage orders
          efficiently, and build lasting relationships with customers in their
          community.
        </p>
        <div className="bg-white p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-medium mb-3 text-orange-600">
            Benefits of Becoming a HUT Partner:
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Increase sales through the HUT platform</li>
            <li>Simple HUT dashboard for order management</li>
            <li>Secure payments through HUT</li>
            <li>Marketing support from HUT</li>
            <li>24/7 HUT support for partners</li>
          </ul>
        </div>
      </section>

      {/* Contact Us */}
      <section className="bg-orange-600 text-white p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-6">Contact HUT</h2>
        <p className="mb-6">
          Have questions about HUT? We'd love to hear from you!
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Phone className="mr-3" />
            <span>+880 1941289443</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-3" />
            <span>shamemmiah2@gmail.com</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-3" />
            <span>HUT Headquarters, Bangladesh</span>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <div className="mt-12 text-center">
        <h3 className="text-lg font-medium mb-4">Follow HUT</h3>
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/sa.shamem.7"
            className="text-orange-600 hover:text-orange-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Facebook</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#"
            className="text-orange-600 hover:text-orange-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Instagram</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <NavLink
            to="/developer-info"
            className="text-orange-600 hover:text-orange-700 flex items-center"
          >
            <Code2 className="h-6 w-6" />
            <span className="ml-1">Developer</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
