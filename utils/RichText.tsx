import React from "react";
import { PortableText } from "@portabletext/react";
import type { SanityRichText } from "types";

const RichText = ({ blocks }: { blocks: SanityRichText[] }) => {
  const serializers = {
    types: {
      break: () => {
        return <br />;
      },
    },
  };

  return <PortableText value={blocks} components={serializers} />;
};

export default RichText;
