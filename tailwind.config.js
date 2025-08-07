/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
    	extend: {
    		screens: {
    			portrait: {
    				raw: '(orientation: portrait)'
    			},
    			landscape: {
    				raw: '(orientation: landscape)'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: '#FAFBFF',
    			foreground: '#060A12',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: '#2C63F1',
    				foreground: '#FAFBFF'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		}
    	},
    	colors: {
    		transparent: 'transparent',
    		primary: '#2C63F1',
    		error: '#F84242',
    		success: '#7BFC5A',
    		black: '#060A12',
    		container: '#F1F3FA',
    		'container-selected': '#EDEFF6',
    		background: '#FAFBFF'
    	},
    	fontFamily: {
    		roboto: [
    			'Roboto',
    			'sans-serif'
    		]
    	}
    },
	plugins: [require("tailwindcss-animate")],
};
