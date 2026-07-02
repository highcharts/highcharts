'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './SidebarResizer.module.css';

const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const STORAGE_KEY = 'docs-preview.sidebarWidth';
const CSS_VARIABLE = '--doc-sidebar-width';
const RESIZING_CLASS = 'docs-sidebar-resizing';

function clampWidth(width: number): number {
    return Math.min(Math.max(Math.round(width), MIN_WIDTH), MAX_WIDTH);
}

function readStoredWidth(): number {
    if (typeof window === 'undefined') {
        return DEFAULT_WIDTH;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? Number(stored) : NaN;

        return Number.isFinite(parsed) ? clampWidth(parsed) : DEFAULT_WIDTH;
    } catch {
        return DEFAULT_WIDTH;
    }
}

function setSidebarWidth(width: number) {
    document.documentElement.style.setProperty(CSS_VARIABLE, `${width}px`);
}

function persistWidth(width: number) {
    try {
        window.localStorage.setItem(STORAGE_KEY, String(width));
    } catch {
        // Ignore storage failures.
    }
}

export default function SidebarResizer({ hidden = false }: { hidden?: boolean }) {
    const handleRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const widthRef = useRef(DEFAULT_WIDTH);
    const frameRef = useRef<number | null>(null);
    const pendingWidthRef = useRef(DEFAULT_WIDTH);
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const [dragging, setDragging] = useState(false);
    const [active, setActive] = useState(false);

    const flushWidth = useCallback(() => {
        frameRef.current = null;
        const nextWidth = pendingWidthRef.current;

        widthRef.current = nextWidth;
        setSidebarWidth(nextWidth);
        setWidth(nextWidth);
    }, []);

    const applyWidth = useCallback((nextWidth: number, persist = false) => {
        const clamped = clampWidth(nextWidth);
        pendingWidthRef.current = clamped;

        if (frameRef.current === null) {
            frameRef.current = window.requestAnimationFrame(flushWidth);
        }

        if (persist) {
            persistWidth(clamped);
        }
    }, [flushWidth]);

    useEffect(() => {
        const storedWidth = readStoredWidth();
        widthRef.current = storedWidth;
        pendingWidthRef.current = storedWidth;
        setSidebarWidth(storedWidth);
        setWidth(storedWidth);
    }, []);

    useEffect(() => {
        function stopDragging() {
            if (!draggingRef.current) {
                return;
            }

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
                widthRef.current = pendingWidthRef.current;
                setSidebarWidth(widthRef.current);
                setWidth(widthRef.current);
            }

            draggingRef.current = false;
            setDragging(false);
            document.documentElement.classList.remove(RESIZING_CLASS);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            persistWidth(widthRef.current);
        }

        function onPointerMove(event: PointerEvent) {
            if (!draggingRef.current || !handleRef.current) {
                return;
            }

            const aside = handleRef.current.closest('aside');

            if (!aside) {
                return;
            }

            const rect = aside.getBoundingClientRect();
            const halfHandle = handleRef.current.offsetWidth / 2;
            applyWidth(event.clientX - rect.left + halfHandle);
        }

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);
        window.addEventListener('blur', stopDragging);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
            window.removeEventListener('blur', stopDragging);

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }

            document.documentElement.classList.remove(RESIZING_CLASS);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [applyWidth]);

    if (hidden) {
        return null;
    }

    const highlight = active || dragging;

    return (
        <>
            <div className={styles.hatchClip} aria-hidden="true">
                <div
                    className={`${styles.hatchInner}${
                        highlight ? ` ${styles.hatchActive}` : ''
                    }${dragging ? ` ${styles.hatchDragging}` : ''}`}
                />
            </div>
            <div
                ref={handleRef}
                className={styles.handle}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
                aria-valuenow={width}
                aria-valuemin={MIN_WIDTH}
                aria-valuemax={MAX_WIDTH}
                tabIndex={0}
                onPointerDown={(event) => {
                    if (event.button !== 0) {
                        return;
                    }

                    event.preventDefault();
                    draggingRef.current = true;
                    setDragging(true);
                    document.documentElement.classList.add(RESIZING_CLASS);
                    document.body.style.userSelect = 'none';
                    document.body.style.cursor = 'col-resize';
                }}
                onPointerEnter={() => setActive(true)}
                onPointerLeave={() => setActive(false)}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        applyWidth(widthRef.current - 16, true);
                    } else if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        applyWidth(widthRef.current + 16, true);
                    } else if (event.key === 'Home') {
                        event.preventDefault();
                        applyWidth(MIN_WIDTH, true);
                    } else if (event.key === 'End') {
                        event.preventDefault();
                        applyWidth(MAX_WIDTH, true);
                    }
                }}
            />
            {dragging ? <div className={styles.overlay} aria-hidden="true" /> : null}
        </>
    );
}
