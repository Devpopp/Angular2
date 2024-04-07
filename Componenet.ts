.ripple-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ripple-container div {
  position: absolute;
  border: 4px solid #fff;
  border-radius: 50%;
  animation: ball-scale-ripple-multiple 1.25s 0s infinite cubic-bezier(.21,.53,.56,.8);
  opacity: 0;
}

.ripple-container div:nth-child(1) {
  animation-delay: 0s;
}
.ripple-container div:nth-child(2) {
  animation-delay: -0.4s;
}
.ripple-container div:nth-child(3) {
  animation-delay: -0.8s;
}

@keyframes ball-scale-ripple-multiple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  70% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
