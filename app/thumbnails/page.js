"use client";

import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShortlist } from '../../context/ShortlistContext';
import ImageItem from '../../components/ImageItem';

export default function ThumbnailsPage() {
    const { stageOneShortlist, addToStageOneShortlist, removeFromStageOneShortlist } = useShortlist();

    const [images, setImages] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const itemsPerPage = 20;

    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        let p = searchParams.get('page');
        if (p)
            setCurrentPage(Number(p) - 1);
    }, [searchParams]);

    useEffect(() => {
        fetch('/api/images')
            .then((res) => res.json())
            .then((data) => {
                setImages(data);
                setPageCount(Math.ceil(data.length / itemsPerPage));
            });
    }, []);

    const o = currentPage * itemsPerPage;
    const currentItems = images.slice(o, o + itemsPerPage);

    const _handlePageChange = ({ selected }) => {
        setCurrentPage(selected);

        const newPageParam = selected + 1;

        const np = new URLSearchParams(searchParams.toString());
        np.set('page', newPageParam.toString());
        router.push(`?${np.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const _toggleShortlist = (imgName) => {
        if (stageOneShortlist.includes(imgName))
            removeFromStageOneShortlist(imgName);
        else
            addToStageOneShortlist(imgName);
    };

    const _openRenders = () => window.open('/renders', '_blank');

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Stage 1: Thumbnails</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {currentItems.map((imgName) => (
                    <ImageItem
                        key={imgName}
                        imgName={imgName}
                        urlPrefix="https://emptycup3d.azureedge.net/render-thumbnails/"
                        isChecked={stageOneShortlist.includes(imgName)}
                        onToggle={_toggleShortlist}
                        containerClass="thumbnailItem"
                        imageClass="thumbnailImage"
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

            <button onClick={_openRenders} className="exportButton">
                Finalize renders
            </button>
        </div>
    );
}
