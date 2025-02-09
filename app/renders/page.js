"use client";

import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShortlist } from '../../context/ShortlistContext';
import ImageItem from '../../components/ImageItem';

export default function FullImagesPage() {
    const {
        stageOneShortlist,
        finalShortlist,
        addToFinalShortlist,
        removeFromFinalShortlist,
        handleExport
    } = useShortlist();

    const itemsPerPage = 6;
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const p = searchParams.get('page');
        if (p)
            setCurrentPage(Number(p) - 1);
    }, [searchParams]);

    let o = currentPage * itemsPerPage;
    const currentItems = stageOneShortlist.slice(o, o + itemsPerPage);
    const pageCount = Math.ceil(stageOneShortlist.length / itemsPerPage);

    const _handlePageChange = ({ selected }) => {
        setCurrentPage(selected);

        const newPageParam = selected + 1;

        const np = new URLSearchParams(searchParams.toString());
        np.set('page', newPageParam.toString());
        router.push(`?${np.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const _toggleFinalShortlist = (imgName) => {
        if (finalShortlist.includes(imgName))
            removeFromFinalShortlist(imgName);
        else
            addToFinalShortlist(imgName);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Stage 2: Renders</h1>

            {stageOneShortlist.length === 0 ? (
                <p>No renders were shortlisted in Stage 1.</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentItems.map((imgName) => (
                            <ImageItem
                                key={imgName}
                                imgName={imgName}
                                urlPrefix="https://emptycup3d.azureedge.net/renders/"
                                isChecked={finalShortlist.includes(imgName)}
                                onToggle={_toggleFinalShortlist}
                                containerClass="fullImageItem"
                                imageClass="fullImage"
                            />
                        ))}
                    </div>

                    <ReactPaginate
                        previousLabel="Prev"
                        nextLabel="Next"
                        onPageChange={_handlePageChange}
                        pageCount={pageCount}
                        forcePage={currentPage}
                        containerClassName="paginationContainer"
                        activeClassName="activePage"
                        pageClassName="pageItem"
                        pageLinkClassName="pageLink"
                        previousClassName="pageItem"
                        previousLinkClassName="pageLink"
                        nextClassName="pageItem"
                        nextLinkClassName="pageLink"
                        breakClassName="pageItem"
                        breakLinkClassName="pageLink"
                        breakLabel="..."
                    />
                </>
            )}

            <button onClick={handleExport} className="exportButton">
                Export Final List
            </button>
        </div>
    );
}
