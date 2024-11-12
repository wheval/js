import { Box, Flex, Icon } from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button, Text } from "tw-components";
import { RefContractInput } from "./ref-input";

interface RefInputFieldsetProps {
  param: AbiParameter;
}

export const RefInputFieldset: React.FC<RefInputFieldsetProps> = ({
  param,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `constructorParams.${param.name ? param.name : "*"}.ref.contracts`,
    control: form.control,
  });

  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Text>Set ref contract for this param.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        {fields.map((item, index) => (
          <RefContractInput
            key={item.id}
            remove={remove}
            index={index}
            param={param}
          />
        ))}
        <Box>
          <Button
            type="button"
            size="sm"
            colorScheme="primary"
            borderRadius="md"
            leftIcon={<Icon as={PlusIcon} />}
            isDisabled={param.type === "address" && fields.length >= 1}
            onClick={() =>
              append({
                contractId: "",
                version: "",
                publisherAddress: "",
              })
            }
          >
            Add Ref
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};
