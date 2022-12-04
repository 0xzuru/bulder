import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import { useRouter } from "next/router";

interface NewMintProps {
  mint: PublicKey;
}

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [metadata, setMetadata] = useState<any>();
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  const router = useRouter();

  useEffect(() => {
    // What this does is to allow us to find the NFT object
    // based on the given mint address

    const mintQuery = router.query.mint as string;

    if (!mint && !mintQuery) return;

    (async () => {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint || mintQuery) })
        .run();

      setMetadata(nft.json);
    })();
  }, [mint, metaplex, walletAdapter]);

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        {metadata && (
          <Image src={metadata.image} alt="" height="250px" width="250px" />
        )}
      </HStack>
    </VStack>
  );
};

export default NewMint;
