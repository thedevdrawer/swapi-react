import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingIcon from '../assets/loading.svg';
import close from '../assets/cancel.png';

function CharacterSingle({ id }) {
    const [character, setCharacter] = useState(null);
    const [speciesName, setSpeciesName] = useState('Loading...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const url = `https://swapi.dev/api/people/${id}`;
                const response = await axios.get(url);

                setCharacter(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    useEffect(() => {
        const fetchSpeciesName = async () => {
            if (character && character.species.length > 0) {
                try {
                    const speciesUrl = character.species[0];
                    const response = await axios.get(speciesUrl);
                    setSpeciesName(response.data.name);
                } catch (error) {
                    setSpeciesName('Unknown');
                    console.error('Error fetching species data:', error);
                }
            } else {
                setSpeciesName('Unknown');
            }
        };

        fetchSpeciesName();
    }, [character]);

    const handleCloseClick = () => {
        setCharacter(null);
    };

    if (loading) {
        return (
            <div className="loadingIcon">
                <img src={loadingIcon} alt="Loading" className="loadingIcon" /><br />
                Loading Content from API
            </div>
        );
    }

    if (error) {
        return (
            <p>Error: {error.message}</p>
        );
    }

    let show = '';
    if(character) {
        show = 'show';
    }else{
        return;
    }

    const formattedCharacter = formatCharacterInformation(character);

    return (
        <div>
            <div className={`overlay ${show}`}></div>
            <div className={`popup ${show}`}>
                <h2>{formattedCharacter.formattedName}</h2>
                <div className="character">
                    <div>
                        {formattedCharacter.name}<br />
                        <strong>Name</strong>
                    </div>
                    <div>
                        {speciesName}<br />
                        <strong>Species</strong>
                    </div>
                    <div>
                        {formattedCharacter.formattedHeight}<br />
                        <strong>Height</strong>
                    </div>
                    <div>
                        {formattedCharacter.formattedMass}<br />
                        <strong>Mass</strong>
                    </div>
                </div>
                <div className="apiinfo">
                    <div>
                        {formattedCharacter.formattedCreateDate}<br />
                        <strong>Added</strong>
                    </div>
                    <div>
                        {formattedCharacter.films.length} Films<br />
                        <strong>Appeared In</strong>
                    </div>
                    <div>
                        {formattedCharacter.formattedBirthYear}<br />
                        <strong>Birth Year</strong>
                    </div>
                </div>
                <div className="close"><img src={close} alt="Close Additional Information" onClick={handleCloseClick} /></div>
            </div>
        </div>
    );
}

const formatCharacterInformation = (character) => {
    const formattedName = (
        <div>
            <span>{character.name.split(" ")[0]}</span><br />
            {character.name.split(" ")[1]}
        </div>
    );

    const formattedID = character.url.split("/").slice(-2, -1)[0];
    const formattedHeight = character.height === "unknown" ? "Unknown" : `${parseFloat(character.height) / 100}m`;
    const formattedMass = character.mass === "unknown" ? "Unknown" : `${parseFloat(character.mass)}kg`;
    const formattedCreateDate = new Date(character.created).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
    const formattedBirthYear = character.birth_year === "unknown" ? "Unknown" : character.birth_year;

    return {
        ...character,
        formattedID,
        formattedName,
        formattedHeight,
        formattedMass,
        formattedCreateDate,
        formattedBirthYear,
    };
};

export default CharacterSingle;
