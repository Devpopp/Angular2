.icon {
    width: 24px; /* Set your required size */
    height: 24px;
    display: inline-block;
    background-color: #FFFFFF; /* Default color */
    -webkit-mask-size: cover;
    mask-size: cover;
}

/* Example specific icons */
.icon-dashboard {
    -webkit-mask-image: url('/path/to/dashboard-icon.png');
    mask-image: url('/path/to/dashboard-icon.png');
}

.icon-settings {
    -webkit-mask-image: url('/path/to/settings-icon.png');
    mask-image: url('/path/to/settings-icon.png');
}

/* Hover and active states for all icons */
.side-menubar li:hover .icon,
.side-menubar li.active .icon {
    background-color: #2596be; /* Color change on hover/active */
}


<li>
    <div class="icon icon-dashboard"></div>
    <span class="nav-text">Dashboard</span>
</li>
<li>
    <div class="icon icon-settings"></div>
    <span class="nav-text">Settings</span>
</li>



