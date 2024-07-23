import { Button } from "@repo/ui/components/ui/button";

const LINKS = [
  {
    heading: "Documentation",
    description: "Find in-depth information about Create-Wave-App features and API.",
    link: "https://docs.vastly.is",
  },
  {
    heading: "Learn",
    description: "Learn about Create-Wave-App.",
    link: "https://docs.vastly.is/getting-started/setting-up-your-first-monorepo",
  },
  {
    heading: "UI",
    description: "Discover and use boilerplate example Vastly UI components.",
    link: "https://ui.vastly.is/",
  },
  {
    heading: "Deploy",
    description: "Instantly deploy your Create-Wave-App site to a public URL.",
    link: "https://docs.vastly.is/publish-and-deploy/future-state",
  },
];

export default function Page(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="w-full max-w-5xl items-center justify-between">
          <p className="text text-lag">Welcome to Create-Wave-App!</p>
        </div>
        <div className="bg-white">
          <Button>TEST BUTTON</Button>
        </div>
        <div className="">
          {LINKS.map((link) => (
            <div key={link.heading}>
              <p>{link.heading}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// const ArrowIcon = () => (
//   <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M20.5312 13.0781L13.0312 20.5781C12.75 20.8594 12.375 21 12 21C11.5781 21 11.2031 20.8594 10.9219 20.5781C10.3125 20.0156 10.3125 19.0312 10.9219 18.4688L15.8438 13.5H1.5C0.65625 13.5 0 12.8438 0 12C0 11.2031 0.65625 10.5 1.5 10.5H15.8438L10.9219 5.57812C10.3125 5.01562 10.3125 4.03125 10.9219 3.46875C11.4844 2.85938 12.4688 2.85938 13.0312 3.46875L20.5312 10.9688C21.1406 11.5312 21.1406 12.5156 20.5312 13.0781Z"
//       fill="#2D3748"
//     />
//   </svg>
// );
