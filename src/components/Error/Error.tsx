import { Heading, Text } from "@radix-ui/themes";
import { Search } from "../../containers/Search";

export const Error = () => {
  return (
    <div className="min-h-[100svh] bg-gray-900 text-white w-screen ">
      <div className="flex flex-col justify-center items-center gap-6 p-3">
        <Search />
        <div className="flex flex-col justify-center items-center gap-2 my-[5rem]">
          <img className="w-20 h-20" src="/reddit.webp" alt="Reddit Logo" />
          <Heading>Something went wrong</Heading>
          <Text align="center">
            Sorry, something went wrong. Please try again with another query
          </Text>
        </div>
      </div>
    </div>
  );
};
