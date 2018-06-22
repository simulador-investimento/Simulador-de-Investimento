<?php
/*
Plugin Name: Simulador de investimento
Description: Um simples simulador de cálculo financeiro, porém eficaz.
Version: 0.0.1
License: ISC
Author: Simulador de investimento
Author URI: https://www.simuladorinvestimento.com.br/
*/

class SimuladorInvestimento 
{
    public static function init()
    {
        add_action('wp_enqueue_scripts', array('SimuladorInvestimento', 'theme_scripts'));
    }
    public static function render($widget = array())
    {        
        include 'templates/form.phtml';
    }

    public static function theme_scripts()
    {
        wp_enqueue_style('simulador-de-investimento-bootstrap', plugins_url('/dist/css/bootstrap.min.css', __FILE__));
        wp_register_script('simulador-de-investimento-bootstrap', plugins_url('/dist/js/bootstrap.min.js', __FILE__), array('jquery'), '', true);
        wp_register_script('simulador-de-investimento-mask', plugins_url('/dist/js/jquery.mask.min.js', __FILE__), array('jquery'), '', true);
        wp_register_script('simulador-de-investimento-script', plugins_url('/dist/js/script.js', __FILE__), array('jquery'), '', true);
        wp_enqueue_script('simulador-de-investimento-bootstrap');
        wp_enqueue_script('simulador-de-investimento-mask');
        wp_enqueue_script('simulador-de-investimento-script');
    }
}

class SimuladorInvestimentoWidget extends WP_Widget
{
    public function __construct()
    {
        parent::__construct(
            'simulador_de_investimento_widget',
            'Simulador de investimento',
            array(
                'customize_selective_refresh' => true,
            )
        );
    }

    public function form($instance)
    {
        $defaults = array(
            'title' => 'Simulador de investimento',         
        );        
        extract(wp_parse_args(( array )$instance, $defaults)); ?>
        <p>
			<label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php _e('Título:', 'text_domain'); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
		</p>
    <?php
    }

    public function update($new_instance, $old_instance)
    {
        $instance = $old_instance;
        $instance['title'] = isset($new_instance['title']) ? wp_strip_all_tags($new_instance['title']) : '';
        return $instance;
    }

    public function widget($args, $instance)
    {
        extract($args);
        $widget['title'] = isset($instance['title']) ? apply_filters('widget_title', $instance['title']) : '';
        SimuladorInvestimento::render($widget);
    }
}

$filePlugin = substr(strrchr(dirname(__FILE__), DIRECTORY_SEPARATOR), 1) . DIRECTORY_SEPARATOR . basename(__FILE__);
add_filter('init', array('SimuladorInvestimento', 'init'));
add_shortcode('SIMULADOR_DE_INVESTIMENTO', array('SimuladorInvestimento', 'render'));

function register_financial_simulator_widget()
{
    register_widget('SimuladorInvestimentoWidget');
}
add_action('widgets_init', 'register_financial_simulator_widget');