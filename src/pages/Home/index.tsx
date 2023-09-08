import { useEffect, useMemo, useCallback } from "react";
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";

// components
import {
  Container,
  FlexBox,
  InitialPokemons,
  PokemonsSection,
  SinglePokemon,
} from "../../components";
import PokemonSearch from "../../components/Molecules/PokemonSearch";

// recoil: atoms
import {
  atomPokemon,
  atomPokemonFetch,
  atomPokemonList,
} from "../../store/atoms";

// recoil: hashs
import { atomHashPokemonsFetch, atomHashPokemonsList } from "../../store/hashes";

// recoil: selectors
import {
  selectorFetchPokemons,
  selectorGetPokemon,
  selectorGetPokemons,
} from "../../store/selectors";

// ::
const HomePage = () => {
  // recoil: states
  const setFetchPokemons = useSetRecoilState(atomPokemonFetch);
  const [pokemon, setPokemon] = useRecoilState(atomPokemon);
  const [pokemonList, setPokemonList] = useRecoilState(atomPokemonList);
  const [hashFetchMorePokemons, setHashFetchMorePokemons] = useRecoilState(
    atomHashPokemonsFetch
  );
  const [hashPokemonsList, setHashPokemonsList] =
    useRecoilState(atomHashPokemonsList);

  // recoil: loadable
  const getLoadablePokemons = useRecoilValueLoadable(selectorGetPokemons);
  const getLoadablePokemon = useRecoilValueLoadable(selectorGetPokemon);
  const fetchLoadablePokemon = useRecoilValueLoadable(selectorFetchPokemons);

  // memo: states
  const disabledFetchMorePokemons = useMemo(() => {
    if (
      fetchLoadablePokemon.state === "hasError" ||
      fetchLoadablePokemon.state === "loading" ||
      getLoadablePokemons.state === "hasError" ||
      getLoadablePokemons.state === "loading"
    ) {
      return true;
    } else {
      return false;
    }
  }, [fetchLoadablePokemon.state, getLoadablePokemons.state]);

  const hasFetchPokemonError = useMemo(() => {
    if (
      fetchLoadablePokemon.state === "hasError" ||
      getLoadablePokemons.state === "hasError"
    ) {
      return true;
    } else {
      return false;
    }
  }, [fetchLoadablePokemon.state, getLoadablePokemons.state]);

  const pokemonsCounter = useMemo(() => {
    return fetchLoadablePokemon.contents.count;
  }, [fetchLoadablePokemon.contents.count]);

  // callbacks
  const retryFethMorePokemon = useCallback(() => {
    if (fetchLoadablePokemon.state === "hasError") {
      setHashFetchMorePokemons(hashFetchMorePokemons + 1);
    }
    if (getLoadablePokemons.state === "hasError") {
      setHashPokemonsList(hashPokemonsList + 1);
    }
  }, [fetchLoadablePokemon.state, getLoadablePokemons.state]);

  // effects
  useEffect(() => {
    if (
      fetchLoadablePokemon.state === "hasValue" &&
      fetchLoadablePokemon.contents !== undefined
    ) {
      setFetchPokemons(fetchLoadablePokemon.contents.results);
    }
  }, [fetchLoadablePokemon.state, fetchLoadablePokemon.contents]);

  useEffect(() => {
    if (
      getLoadablePokemons.state === "hasValue" &&
      getLoadablePokemons.contents !== undefined
    ) {
      if (pokemonList.length > 0) {
        const filteredList = getLoadablePokemons.contents.filter(
          (pokemon) => !pokemonList.find((item) => item.name === pokemon.name)
        );

        setPokemonList(pokemonList.concat(filteredList));
      } else {
        setPokemonList(getLoadablePokemons.contents);
      }
    }
  }, [getLoadablePokemons.state, getLoadablePokemons.contents]);

  useEffect(() => {
    if (
      getLoadablePokemon?.state === "hasValue" &&
      getLoadablePokemon?.contents !== undefined
    ) {
      setPokemon(getLoadablePokemon.contents);
    }
  });

  return (
    <Container>
      <FlexBox
        align="flex-start"
        justify="flex-start"
        direction="column"
        gap="xxxs"
      >
        <InitialPokemons />
        <PokemonSearch />
        <SinglePokemon
          pokemon={pokemon}
          error={getLoadablePokemon.state === "hasError"}
          loading={getLoadablePokemon.state === "loading"}
        />
      </FlexBox>
      <PokemonsSection
        pokemons={pokemonList}
        disabledFetch={disabledFetchMorePokemons}
        hasErrors={hasFetchPokemonError}
        loading={
          getLoadablePokemons.state === "loading" ||
          fetchLoadablePokemon.state === "loading"
        }
        pokemonCount={pokemonsCounter}
        retryFetch={retryFethMorePokemon}
      />
    </Container>
  );
};

export default HomePage;