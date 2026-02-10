from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime
import json
import requests
from bs4 import BeautifulSoup
import urllib.parse
import logging
import asyncio
import time
import random
from playwright.sync_api import sync_playwright
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import jwt  # PyJWT library
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import certifi
import hashlib
import json as json_lib

# Load environment variables from the same directory as this file
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
try:
    # Use certifi to ensure reliable SSL connections, especially for MongoDB Atlas
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
    client.server_info()  # Will throw an exception if not connected
    db = client['scrapeflow_db']
    scraping_jobs_collection = db['scraping_jobs']
    logging.info("Connected to MongoDB successfully")
except Exception as e:
    logging.error(f"Could not connect to MongoDB: {e}")
    client = None
    db = None
    scraping_jobs_collection = None

# Custom JSON encoder to handle ObjectId
from bson import json_util

def create_json_response(data):
    """Custom function to handle JSON serialization with ObjectId support"""
    return json.loads(json_util.dumps(data))

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'ScrapeFlow backend is running', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/api/scrape', methods=['POST'])
def scrape_url():
    try:
        data = request.json
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400
        
        url = data['url']
        
        # Validate URL
        parsed_url = urllib.parse.urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            return jsonify({'error': 'Invalid URL format'}), 400
        
        # Enhanced scraping logic with smart anti-bot detection
        # Use hardcoded list for stability instead of fake_useragent which may fail
        USER_AGENTS = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
        ]
        
        # Randomize headers for every request
        user_agent = random.choice(USER_AGENTS)
        headers = {
            'User-Agent': user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        }
        
        logging.info(f"Scraping {url} with User-Agent: {user_agent[:30]}...")
        
        try:
            # Use a session to maintain cookies
            session = requests.Session()
            response = session.get(url, headers=headers, timeout=20)
            
            # Smart content check for blocking
            # Even if status is 200, the content might be a CAPTCHA or blocking page
            page_text_lower = response.text.lower()
            blocking_keywords = [
                'captcha', 'robot check', 'security check', 'access denied', 
                'automated access', 'please verify you are a human', 'shield square',
                'before you continue', 'accept all', 'reject all', 'cookie policy'
            ]
            is_blocked = any(keyword in page_text_lower for keyword in blocking_keywords)
            
            # Parse the HTML content from regular request
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Initial extraction to check quality
            temp_links = soup.find_all('a', href=True)
            temp_images = soup.find_all('img')
            
            # If we got very little content (likely a JS wrapper or skeleton), force advanced scraping
            # YouTube/SPA detection: High text count (scripts) but low link/image count
            if len(temp_links) < 5 or len(temp_images) < 2:
                 logging.info("Standard request returned low content (likely SPA/JS-heavy). Switching to advanced scraping...")
                 raise Exception("Low content detected")

        except Exception as e:
            # Fallback block - Catches both Request errors and our custom "Low content" exception
            if isinstance(e, requests.exceptions.Timeout):
                error_msg = 'Request timed out'
            elif isinstance(e, requests.exceptions.ConnectionError):
                error_msg = 'Connection error'
            else:
                 error_msg = str(e)
            
            logging.info(f"Standard scraping failed/insufficient: {error_msg}. Starting Playwright...")

            # Method 1: Try with Playwright (most effective for JavaScript-heavy sites)
            try:
                logging.info("Attempting Playwright scraping...")
                with sync_playwright() as p:
                    # Use Firefox for better stealth
                    browser = p.firefox.launch(headless=True)
                    context = browser.new_context(
                        user_agent=user_agent,
                        viewport={'width': 1920, 'height': 1080},
                        locale='en-US',
                        timezone_id='America/New_York',
                        java_script_enabled=True
                    )
                    
                    page = context.new_page()
                    
                    # Enhanced stealth
                    page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                    page.set_extra_http_headers(headers)
                    
                    # Navigate and Wait
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(3000) # Give JS time to hydrate
                    
                    # Scroll to load lazy content
                    for _ in range(3):
                        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        page.wait_for_timeout(1000)
                    
                    # Cookie Handling
                    try:
                        page.click('button[aria-label*="Accept"], span:has-text("Accept all")', timeout=2000)
                    except:
                        pass

                    content = page.content()
                    
                    # Extract Data using Playwright (more reliable for Shadow DOM/SPAs)
                    # We'll use BS4 on the rendered content (Light DOM) which usually contains the hydrated elements
                    # But for Title, we prefer JS evaluation
                    title = page.title()
                    if not title or title == "YouTube":
                         title = page.evaluate("() => document.querySelector('meta[property=\"og:title\"]')?.content || document.title")
                    
                    browser.close()
                    
                    soup = BeautifulSoup(content, 'html.parser')
                    
                    # Validate the Playwright result too
                    if len(soup.find_all('a', href=True)) < 5:
                         logging.warning("Playwright also returned low content.")
                    
            except Exception as playwright_error:
                logging.warning(f"Playwright failed: {playwright_error}")
                # Method 2: Try Selenium as fallback
                try:
                    logging.info("Attempting Selenium scraping...")
                    chrome_options = Options()
                    chrome_options.add_argument("--headless")
                    chrome_options.add_argument(f"user-agent={user_agent}")
                    chrome_options.add_argument("--no-sandbox")
                    chrome_options.add_argument("--disable-dev-shm-usage")
                    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
                    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"]) 
                    chrome_options.add_experimental_option('useAutomationExtension', False)
                    
                    # Use webdriver-manager
                    service = Service(ChromeDriverManager().install())
                    driver = webdriver.Chrome(service=service, options=chrome_options)
                    
                    # Stealth script
                    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                    
                    driver.get(url)
                    
                    time.sleep(random.uniform(3, 6))
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    
                    content = driver.page_source
                    title = driver.title
                    driver.quit()
                    
                    soup = BeautifulSoup(content, 'html.parser')
                    
                except Exception as selenium_error:
                    logging.error(f"All scraping methods failed. Playwright: {playwright_error}, Selenium: {selenium_error}")
                    if is_blocked:
                         return jsonify({'error': 'Access denied by website security. Try a different URL or wait a moment.'}), 403
                    return jsonify({'error': 'Failed to retrieve content. The website may be protected.'}), 500

        else:  # This else belongs to the main try block (line 106)
            # This executes when the initial request succeeds without throwing an exception
            # In this case, soup has already been defined on line 122
            # So we don't need to re-parse, it's already done
            pass  # soup is already defined from line 122

        # The extraction code continues after this point
        # Extract relevant information
        # If title was already extracted via Playwright, use it; otherwise extract from soup
        if 'title' not in locals() or not title or title == 'No title':
            title_tag = soup.find('meta', property='og:title') or soup.find('meta', attrs={'name': 'twitter:title'}) or soup.title
            title = title_tag['content'] if title_tag and hasattr(title_tag, 'content') else (title_tag.string if title_tag else 'No title')
        
        # Extract all text
        text_content = soup.get_text(strip=True, separator=' ')
        
        # Extract all links
        links = []
        for link in soup.find_all('a', href=True):
            link_url = link['href']
            # Filter out empty or javascript links
            if not link_url or link_url.startswith('javascript:') or link_url == '#':
                continue
                
            if link_url.startswith('/'):
                # Convert relative URLs to absolute
                link_url = urllib.parse.urljoin(url, link_url)
            
            link_text = link.get_text(strip=True)
            # Fallback for image-only links
            if not link_text:
                img = link.find('img')
                if img:
                    link_text = img.get('alt') or 'Image Link'
            
            if link_text:
                links.append({
                    'text': link_text[:100], # Trucate long text
                    'url': link_url
                })
        
        # Extract all images - Enhanced
        images = []
        # Check for standard img tags
        for img in soup.find_all('img'):
            img_src = img.get('src') or img.get('data-src') or img.get('data-original')
            if img_src and not img_src.startswith('data:'): # Skip base64
                if img_src.startswith('/'):
                    img_src = urllib.parse.urljoin(url, img_src)
                if img_src.startswith('http'):
                    images.append({
                        'src': img_src,
                        'alt': img.get('alt', ''),
                        'title': img.get('title', '')
                    })
        
        # Check for meta og:image if few images found
        if len(images) < 5:
            og_img = soup.find('meta', property='og:image')
            if og_img and og_img.get('content'):
                images.insert(0, {'src': og_img['content'], 'alt': 'Social Share Image', 'title': 'Main Image'})
        
        # Extract product information (for e-commerce sites)
        product_info = {}
        
        # Try to find product name
        product_name = None
        for selector in ['h1.product-title', 'h1.title', '.product-name', '.product-title', '[data-testid="product-title"]', '[data-product-title]']:
            element = soup.select_one(selector)
            if element:
                product_name = element.get_text(strip=True)
                break
        product_info['name'] = product_name
        
        # Try to find price
        price = None
        for selector in ['.price', '.product-price', '.current-price', '.sale-price', '[data-price]', '.money', '.cost']:
            element = soup.select_one(selector)
            if element:
                price = element.get_text(strip=True)
                break
        product_info['price'] = price
        
        # Try to find product description
        description = None
        for selector in ['.description', '.product-description', '.product-details', 'meta[name="description"]', 'meta[property="og:description"]']:
            element = soup.select_one(selector)
            if element:
                description = element.get('content', element.get_text(strip=True))
                break
        product_info['description'] = description
        
        # Try to find product category
        category = None
        for selector in ['.breadcrumb', '.category', '.product-category', '.nav-breadcrumb']:
            element = soup.select_one(selector)
            if element:
                category = element.get_text(strip=True)
                break
        product_info['category'] = category
        
        # Extract meta tags
        meta_tags = {}
        for meta in soup.find_all('meta'):
            name = meta.get('name') or meta.get('property')
            content = meta.get('content')
            if name and content:
                meta_tags[name] = content
        
        # Extract schema.org structured data
        schema_data = []
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                schema_content = json_lib.loads(script.string)
                schema_data.append(schema_content)
            except:
                pass
        
        # Extract headers (h1, h2, h3, etc.)
        headers = []
        for tag in ['h1', 'h2', 'h3']:
            for element in soup.find_all(tag):
                headers.append({
                    'tag': tag,
                    'text': element.get_text(strip=True)
                })
        
        # Extract product features or specifications
        features = []
        for selector in ['.features', '.specifications', '.specs', '.product-features']:
            element = soup.select_one(selector)
            if element:
                for item in element.find_all(['li', 'div', 'span']):
                    feature_text = item.get_text(strip=True)
                    if feature_text:
                        features.append(feature_text)
                break
        
        # Extract product reviews (if available)
        reviews = []
        for selector in ['.reviews', '.review', '.customer-reviews']:
            review_elements = soup.select(selector)
            for review in review_elements[:5]:  # Limit to first 5 reviews
                review_text = review.get_text(strip=True)
                if review_text:
                    reviews.append(review_text[:200])  # Limit length
            if reviews:
                break
        
        # Create the scraping result
        result = {
            'url': url,
            'title': title,
            'textContent': text_content[:1000] + ('...' if len(text_content) > 1000 else ''),  # Limit text length
            'links': links[:50],  # Limit to first 50 links
            'images': images[:20],  # Limit to first 20 images
            'productInfo': product_info,
            'metaTags': meta_tags,
            'schemaData': schema_data,
            'headers': headers[:30],  # Limit to first 30 headers
            'features': features[:10],  # Limit to first 10 features
            'reviews': reviews[:5],  # Limit to first 5 reviews
            'scrapedAt': datetime.utcnow().isoformat(),
            'wordCount': len(text_content.split())
        }
        
        # Store in MongoDB for history if available
        # Force disable DB write temporarily to debug "Collection" error
        if False and scraping_jobs_collection:
            try:
                result_db = scraping_jobs_collection.insert_one({
                    'url': url,
                    'title': title,
                    'result': result,
                    'createdAt': datetime.utcnow()
                })
                result['id'] = str(result_db.inserted_id)
            except Exception as e:
                logging.error(f"Could not save to MongoDB: {e}")
                result['id'] = str(url.__hash__())  # Use a hash of the URL as ID if DB fails
        else:
            # Generate a simple ID if no database is available
            result['id'] = str(url.__hash__())
        
        return jsonify(result)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Scraping failed: {str(e)}'}), 500

@app.route('/api/history', methods=['GET'])
def get_scraping_history():
    try:
        if scraping_jobs_collection:
            # Get the most recent scraping jobs
            jobs = list(scraping_jobs_collection.find({}).sort('createdAt', -1).limit(10))
            
            return jsonify(create_json_response(jobs))
        else:
            # Return empty list if no database is available
            return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication routes
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Check if user already exists
        if db and db.users.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 409
        
        # Hash password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Create new user
        user_data = {
            'email': email,
            'password': hashed_password,
            'createdAt': datetime.utcnow(),
            'isActive': True
        }
        
        if db:
            result = db.users.insert_one(user_data)
            user_data['_id'] = str(result.inserted_id)
        
        # Generate token
        token = jwt.encode({
            'user_id': str(user_data['_id']),
            'email': user_data['email'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {'email': user_data['email']}
        })
    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user
        if db:
            user = db.users.find_one({'email': email})
        else:
            return jsonify({'message': 'Database not available'}), 500
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        if user['password'] != hashed_password:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {'email': user['email']}
        })
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
def profile():
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Access token is required'}), 401
        
        token = token.split(' ')[1]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            if db:
                user = db.users.find_one({'_id': ObjectId(payload['user_id'])})
                if user:
                    return jsonify({'email': user['email'], 'id': str(user['_id'])})
            return jsonify({'message': 'User not found'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'message': 'Profile access failed', 'error': str(e)}), 500

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)