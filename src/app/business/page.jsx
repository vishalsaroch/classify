'use client'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { isLogin, placeholderImage } from '@/utils';
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { t } from '@/utils';
import toast from 'react-hot-toast';
import { allItemApi } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { Select, Spin } from 'antd';

const { Option } = Select;

const BusinessPage = () => {
    const router = useRouter();
    const userData = useSelector(userSignUpData);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchItems = async (page = 1) => {
        try {
            setLoading(true);
            const response = await allItemApi.allItem({
                page,
                user_id: userData?.id,
                sort: sortBy
            });
            
            const { data } = response.data;
            if (page === 1) {
                setItems(data.data);
            } else {
                setItems(prev => [...prev, ...data.data]);
            }
            setLastPage(data.last_page);
            setCurrentPage(data.current_page);
        } catch (error) {
            console.error('Error fetching items:', error);
            toast.error(t('errorFetchingItems'));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!isLogin()) {
            toast.error(t('loginFirst'));
            router.push('/login');
            return;
        }

        if (!userData?.is_seller) {
            toast.error(t('sellerAccessOnly'));
            router.push('/');
            return;
        }

        fetchItems();
    }, [sortBy]);

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const loadMore = () => {
        if (currentPage < lastPage && !loadingMore) {
            setLoadingMore(true);
            fetchItems(currentPage + 1);
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">{t('myBusiness')}</h1>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <h2 className="h4 mb-0 me-3">{t('myProducts')}</h2>
                                    <Select
                                        defaultValue="newest"
                                        style={{ width: 120 }}
                                        onChange={handleSortChange}
                                        className="ms-2"
                                    >
                                        <Option value="newest">{t('newest')}</Option>
                                        <Option value="oldest">{t('oldest')}</Option>
                                        <Option value="price_high">{t('priceHigh')}</Option>
                                        <Option value="price_low">{t('priceLow')}</Option>
                                    </Select>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => router.push('/ad-listing')}
                                >
                                    {t('addNewProduct')}
                                </button>
                            </div>
                            
                            {loading && items.length === 0 ? (
                                <div className="text-center py-5">
                                    <Spin size="large" />
                                </div>
                            ) : items.length > 0 ? (
                                <>
                                    <div className="row g-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <Link href={`/product-details/${item.id}`} className="text-decoration-none">
                                                    <div className="card h-100">
                                                        <div className="position-relative">
                                                            <Image
                                                                src={item.image || placeholderImage}
                                                                alt={item.name}
                                                                width={300}
                                                                height={200}
                                                                className="card-img-top object-fit-cover"
                                                                onError={placeholderImage}
                                                            />
                                                            {item.featured && (
                                                                <span className="position-absolute top-0 start-0 badge bg-primary m-2">
                                                                    {t('featured')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="card-body">
                                                            <h5 className="card-title text-truncate">{item.name}</h5>
                                                            <p className="card-text text-primary fw-bold mb-2">
                                                                {item.currency_symbol}{item.price}
                                                            </p>
                                                            <p className="card-text text-truncate text-muted small mb-0">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {currentPage < lastPage && (
                                        <div className="text-center mt-4">
                                            <button 
                                                className="btn btn-outline-primary"
                                                onClick={loadMore}
                                                disabled={loadingMore}
                                            >
                                                {loadingMore ? t('loading') : t('loadMore')}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="mb-0">{t('noProductsFound')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPage;