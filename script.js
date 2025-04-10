document.addEventListener('DOMContentLoaded', function() {
    // --- Typing Effect --- 
    /* Remove old typing effect
    const nameElement = document.getElementById('typed-name');
    const nameToType = "Kudupudi Satya Durga Anjali";
    let charIndex = 0;

    function typeName() {
        if (charIndex < nameToType.length) {
            nameElement.textContent += nameToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeName, 100); 
        } else {
            nameElement.style.animation = 'none'; 
            nameElement.style.borderRightColor = 'transparent';
        }
    }
    setTimeout(typeName, 500);
    */
   // Add a simple text reveal for the name now
   const nameElement = document.getElementById('typed-name');
   if(nameElement) {
       nameElement.innerHTML = 'Kudupudi Satya Durga Anjali'; // Set name directly
       // Could add a simple Anime.js reveal here too if desired
   }

    // --- Intersection Observer for Section Animations --- 
    const sections = document.querySelectorAll('main section'); // Target all sections in main

    // Helper function for Anime.js text animation
    function animateText(element) {
        if (!element) return;
        // Wrap every letter in a span
        element.innerHTML = element.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({loop: false})
          .add({
            targets: element.querySelectorAll('.letter'),
            translateY: [-30, 0], // Increased starting offset
            opacity: [0,1],
            rotateZ: [-15, 0], // Add rotation
            scale: [0.8, 1], // Add scaling
            easing: "easeOutBack", // Use a bouncier easing
            duration: 1200, // Slightly longer duration
            delay: (el, i) => 60 * i // Slightly longer stagger
          });
    }

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% (adjust as needed)
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate the section title (h2) using Anime.js
                const titleElement = entry.target.querySelector('h2');
                animateText(titleElement);

                // Add staggered animation to child elements (using CSS transitions)
                const elementsToStagger = entry.target.querySelectorAll('li, article, .about-columns > div'); // Target lists, projects, about columns
                elementsToStagger.forEach((el, index) => {
                    el.style.transitionDelay = `${index * 0.1}s`; // 100ms delay increment
                });

                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- PDF Download --- 
    const downloadButton = document.getElementById('download-page-pdf');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const originalElement = document.getElementById('resume-for-pdf');
            const elementToPrint = originalElement.cloneNode(true);

            elementToPrint.style.position = 'absolute';
            elementToPrint.style.left = '-9999px';
            elementToPrint.style.top = '0px';
            elementToPrint.style.display = 'block';
            
            document.body.appendChild(elementToPrint);

            // Add a small delay to allow rendering before capture
            setTimeout(() => {
                const options = {
                    margin:       [0.2, 0.2, 0.2, 0.2],
                    filename:     'Kudupudi_Satya_Durga_Anjali_Resume.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        // Calculate width *after* element is appended and potentially rendered
                        width: elementToPrint.offsetWidth 
                    },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
                    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
                };

                html2pdf().set(options).from(elementToPrint).save().then(() => {
                    document.body.removeChild(elementToPrint);
                }).catch((error) => {
                    console.error("Error generating PDF:", error);
                    if (document.body.contains(elementToPrint)) {
                        document.body.removeChild(elementToPrint);
                    }
                });
            }, 100); // 100ms delay - adjust if needed
        });
    }
});