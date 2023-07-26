import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from "embla-carousel-react";
import { Heading, Box, Container, Text } from "@vastly/ui";
// import {
//   DotButton,
//   PrevButton,
//   NextButton
// } from './EmblaCarouselArrowsDotsButtons'
// import imageByIndex from './imageByIndex'

type Content = {
  heading: string;
  description: string;
};

type PropType = {
  slides: Content[];
  options?: EmblaOptionsType;
};

const EmblaCarousel = (props: PropType) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <>
      <Box bg="brand.teal" color="white" className="embla">
        <Box className="embla__viewport" ref={emblaRef}>
          <Box className="embla__container">
            {slides.map((slide, index) => (
              <Box className="embla__slide" key={index}>
                <Container>
                  <Heading>{slide.heading}</Heading>
                  <Text>{slide.description}</Text>
                </Container>
              </Box>
            ))}
          </Box>
        </Box>

        {/* <div className="embla__buttons">
          <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
          <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
        </div> */}
      </Box>
    </>
  );
};

export default EmblaCarousel;
