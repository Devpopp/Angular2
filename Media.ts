
/* Apply 1rem left and right margin for all elements and screen sizes */
.adjust-for-sidebar {
    margin-left: 1rem;
    margin-right: 1rem;
}

/* Media queries for different screen sizes */
@media (min-width: 1601px) {
    .adjust-for-sidebar {
        background-color: #0495ce;
        width: 99%;
    }

    .wrapperForecast {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 1323px) and (max-width: 1600px) {
    .adjust-for-sidebar {
        /* No need to redefine margin here */
    }

    .wrapperForecast {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 1000px) and (max-width: 1322px) {
    .adjust-for-sidebar {
        /* No need to redefine margin here */
    }

    .wrapperForecast {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 768px) and (max-width: 999px) {
    .adjust-for-sidebar {
        /* No need to redefine margin here */
    }

    .wrapperForecast {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .adjust-for-sidebar {
        /* No need to redefine margin here */
    }

    .wrapperForecast {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 100px) and (max-width: 575px) {
    .adjust-for-sidebar {
        /* No need to redefine margin here */
    }

    .wrapperForecast {
        grid-template-columns: repeat(1, 1fr);
    }
}
