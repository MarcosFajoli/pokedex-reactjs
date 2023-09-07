import { atomPokemon } from "../../store/atoms";
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { selectorGetPokemon } from "../../store/selectors";
import { useState } from "react";

const HomePage = () => {
    const [searchPokemon, setSearchPokemon] = useState("");
    const [pokemon, setPokemon] = useRecoilState(atomPokemon); 
    const getLoadablePokemon = useRecoilValueLoadable(selectorGetPokemon);

    return (
        <div>
            <input 
                type="text"
                onChange={(event) => setSearchPokemon(event.target.value)} 
            />
            <button onClick={() => setPokemon(searchPokemon)}>Procurar</button>
            {getLoadablePokemon?.state === "loading" && <div>Loading...</div>}
            {getLoadablePokemon?.state === "hasValue" && 
                getLoadablePokemon?.contents !== undefined && (
                    <div>
                        <img 
                            width="150px"
                            src={getLoadablePokemon?.contents?.sprites?.front_default} 
                            alt="pokemon" 
                        />
                        <h3>{getLoadablePokemon?.contents?.name}</h3>
                    </div>
                )
            }
        </div>
    );
};

export default HomePage;