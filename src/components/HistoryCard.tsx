import { HStack, Heading, Text, VStack } from "native-base";

import { HistoryDTO } from "@dtos/HistoryDTO";

type Props = {
  data: HistoryDTO;
}

export function HistoryCard({ data: { name, group, hour } }: Props) {
  return (
    <HStack w="full" px={5} py={4} mb={4} bg="gray.600" rounded="md" alignItems="center" justifyContent="space-between">
      <VStack mr={5} flex={1}>
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          numberOfLines={1}
          fontFamily='heading'
        >
          {group}
        </Heading>
        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {name}
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        {hour}
      </Text>
    </HStack>
  )
}
