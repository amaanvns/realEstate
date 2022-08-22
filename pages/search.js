import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/Image";
import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import { BsFilter } from "react-icons/bs";
import SearchFilters from "../components/SearchFilters";
import Property from "../components/Property";
import { fetchApi, baseUrl } from "../utils/fetchApi";

const Search = ({ properties }) => {
  const [searchFitlers, setSearchFilters] = useState(false);
  const router = useRouter();

  return (
    <Box>
      <Flex
        cursor="pointer"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
        p="2"
        fontWeight="black"
        fontSize="lg"
        justifyContent="center"
        alignItems="center"
        onClick={() => setSearchFilters(!searchFitlers)}
      >
        <Text>Search Property By filter</Text>
        <Icon paddingLeft="2" w="7" as={BsFilter}></Icon>
      </Flex>
      {searchFitlers && <SearchFilters />}
      <Text fontSize="2xl" p="4" fontWeight="bold">
        Properties {router.query.purpose}
      </Text>
      <Flex flexWrap="wrap">
        {properties.map((property) => (
          <Property property={property} key={property} />
        ))}
      </Flex>
      {properties.length === 0 && (
        <>
          <Flex
            justifyContent="center"
            alignItem="center"
            flexDirection="colum"
            marginTop="5"
            marginBottom="5"
          >
            <Image alt="no result" />
            <Text fontSize="2xl" marginTop="3">
              No Result Found
            </Text>
          </Flex>
        </>
      )}
    </Box>
  );
};

export async function getServerSideProps(context) {
  const purpose = context.query.purpose || "for-rent";
  const rentFrequency = context.query.rentFrequency || "yearly";
  const minPrice = context.query.minPrice || "0";
  const maxPrice = context.query.maxPrice || "1000000";
  const roomsMin = context.query.roomsMin || "0";
  const bathsMin = context.query.bathsMin || "0";
  const sort = context.query.sort || "price-desc";
  const areaMax = context.query.areaMax || "35000";
  const locationExternalIDs = context.query.locationExternalIDs || "5002";
  const categoryExternalID = context.query.categoryExternalID || "4";

  const data = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`
  );
  return {
    props: {
      properties: data?.hits,
    },
  };
}

export default Search;
