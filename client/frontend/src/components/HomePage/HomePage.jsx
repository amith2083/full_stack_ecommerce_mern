import { Link } from "react-router-dom";
import HomeCategories from "./HomeCategories";
import HomeProductTrending from "./HomeProductTrending";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard } from "lucide-react";


const offers = [
 {
  title: "End of Season Sale",
  description: "Up to 70% off on top fashion brands",
  href: "/",
},
{
  title: "Free Shipping",
  description: "On orders above ₹999. No hidden charges.",
  href: "/",
},
{
  title: "New Arrivals",
  description: "Fresh drops for men & women – shop the latest trends",
  href: "/",
}
];


export default function Example() {
  return (
    <div className="bg-white">
      <main>
        {/* Hero */}
        <div className="flex flex-col border-b border-gray-200 lg:border-0 ">
          <nav aria-label="Offers" className="order-last lg:order-first">
            <div className="mx-auto max-w-7xl lg:px-8">
              <ul
                role="list"
                className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-y-0 lg:divide-x">
                {offers.map((offer) => (
                  <li key={offer.name} className="flex flex-col">
                    <Link
                      path={offer.href}
                      className="relative flex flex-1 flex-col justify-center bg-white py-6 px-4 text-center focus:z-10">
                      <p className="text-sm text-gray-500">{offer.name}</p>
                      <p className="font-semibold text-gray-900">
                        {offer.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
            />
            <div className="relative bg-gray-100 lg:bg-transparent">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
                <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                  <div className="lg:pr-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                      Shop with confidence
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                      New products are added every week. Check back often to see
                    </p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className="inline-block rounded-md border border-transparent bg-black py-3 px-8 font-medium text-white hover:bg-indigo-700">
                        Shop Productivity
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-48 w-full sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
              <img
                src="/images/male-tailor.jpg"
                 loading="lazy"
                alt="Male tailor working on fabric"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          {/* Sale */}
          <section
            aria-labelledby="sale-heading"
            className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <h2
                id="sale-heading"
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Get 25% off during our one-time sale
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
                Most of our products are limited releases that won't come back.
                Get your favorite items while they're in stock.
              </p>
              <a
                href="#"
                className="mt-6 inline-block w-full rounded-md border border-transparent bg-gray-900 py-3 px-8 font-medium text-white hover:bg-gray-800 sm:w-auto">
                Get access to our one-time sale
              </a>
            </div>
          </section>
        </div>
      </main>
      <main>
        {/* Category section */}
        <section
          aria-labelledby="category-heading"
          className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8">
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="category-heading"
              className="text-2xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <Link
              to="/all-categories"
              className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
          {/* home categories */}
          <HomeCategories />
        </section>
        {/* Home trending trending */}
        <HomeProductTrending />

        {/* info */}
  
      </main>
    </div>
  );
}
