'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import TopNavbar from '@/components/TopNavbar';

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('c');
    console.log(category);

    useEffect(() => {
        // TODO: backend route to fetch category data...
    }, [category]);

    return (
    <>
        <TopNavbar/>
        <h1>Forum Category: {category}</h1>
    </>
    );
};

export default CategoryPage;