'use client';
import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((post) => (
                <PromptCard key={post._id} post={post} handleClick={handleTagClick} />
            ))}
        </div>
    );
};

const Feed = () => {
    const [allPosts, setAllPosts] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const reponse = await fetch('/api/prompt');
            const data = await reponse.json();
            setAllPosts(data);
        };
        fetchPosts();
    }, []);

    const filterPrompts = (searchtext) => {
        const regex = new RegExp(searchtext, 'i');
        return allPosts.filter(
            (item) => regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt),
        );
    };
    const handelSearchTextChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        //debounded search
        setSearchTimeout(
            setTimeout(() => {
                const searchResult = filterPrompts(e.target.value);
                setSearchResults(searchResult);
            }, 500),
        );
    };

    const handleTagClick = (tag) => {
        setSearchText(tag);
        const searchResult = filterPrompts(tag);
        setSearchResults(searchResult);
    };

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for a tag or a username"
                    value={searchText}
                    onChange={handelSearchTextChange}
                    required
                    className="search_input peer"
                />
            </form>
            {searchText ? (
                <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
            ) : (
                <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
            )}
        </section>
    );
};

export default Feed;
